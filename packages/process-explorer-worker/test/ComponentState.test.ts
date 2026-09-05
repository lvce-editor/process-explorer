import { beforeEach, expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ProcessExplorerStates from '../src/parts/ProcessExplorerStates/ProcessExplorerStates.ts'

beforeEach(() => {
  ProcessExplorerStates.clear()
})

test('gets and sets the live component state through worker commands', async () => {
  const uid = 101
  const oldState = { ...createDefaultState(), uid }
  const newState = { ...oldState, errorMessage: 'Live State Error' }
  ProcessExplorerStates.set(uid, oldState, oldState)

  expect(commandMap['ProcessExplorer.getComponentState'](uid)).toBe(oldState)
  await commandMap['ProcessExplorer.setComponentState'](uid, newState)

  expect(commandMap['ProcessExplorer.getComponentState'](uid)).toEqual(newState)
  expect(ProcessExplorerStates.get(uid)).toEqual({
    newState,
    oldState,
    scheduledState: newState,
  })

  const diff = commandMap['ProcessExplorer.diff2'](uid)
  const commands = await commandMap['ProcessExplorer.render2'](uid, diff)
  expect(JSON.stringify(commands)).toContain('Live State Error')
  expect(ProcessExplorerStates.get(uid).oldState).toEqual(newState)
})

test.each([null, [], 'invalid', 42])(
  'rejects invalid live component state %p without changing the state',
  async (invalidState) => {
    const state = createDefaultState()
    ProcessExplorerStates.set(state.uid, state, state)

    await expect(
      commandMap['ProcessExplorer.setComponentState'](state.uid, invalidState),
    ).rejects.toThrow('Process Explorer state must be an object')
    expect(commandMap['ProcessExplorer.getComponentState'](state.uid)).toBe(
      state,
    )
  },
)

test('rejects changing the component uid without changing either component', async () => {
  const state = createDefaultState()
  const otherState = { ...state, uid: 2 }
  ProcessExplorerStates.set(state.uid, state, state)
  ProcessExplorerStates.set(otherState.uid, otherState, otherState)

  await expect(
    commandMap['ProcessExplorer.setComponentState'](state.uid, otherState),
  ).rejects.toThrow('Process Explorer state uid must remain 1')
  expect(commandMap['ProcessExplorer.getComponentState'](state.uid)).toBe(state)
  expect(commandMap['ProcessExplorer.getComponentState'](otherState.uid)).toBe(
    otherState,
  )
})
