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

test('gets the current virtual DOM from the component state', () => {
  const uid = 102
  const state = { ...createDefaultState(), initial: false, uid }
  ProcessExplorerStates.set(uid, state, state)

  expect(commandMap['ProcessExplorer.getComponentDom'](uid)).toContainEqual(
    expect.objectContaining({ className: 'Viewlet ProcessExplorer' }),
  )
})

test.each([null, [], 'invalid', 42])(
  'rejects invalid live component state %p without changing the state',
  async (invalidState) => {
    const state = createDefaultState()
    const { uid } = state
    ProcessExplorerStates.set(uid, state, state)

    await expect(
      commandMap['ProcessExplorer.setComponentState'](uid, invalidState),
    ).rejects.toThrow('Process Explorer state must be an object')
    expect(commandMap['ProcessExplorer.getComponentState'](uid)).toBe(state)
  },
)

test('rejects changing the component uid without changing either component', async () => {
  const state = createDefaultState()
  const { uid } = state
  const otherState = { ...state, uid: 2 }
  ProcessExplorerStates.set(uid, state, state)
  ProcessExplorerStates.set(otherState.uid, otherState, otherState)

  await expect(
    commandMap['ProcessExplorer.setComponentState'](uid, otherState),
  ).rejects.toThrow('Process Explorer state uid must remain 1')
  expect(commandMap['ProcessExplorer.getComponentState'](uid)).toBe(state)
  expect(commandMap['ProcessExplorer.getComponentState'](otherState.uid)).toBe(
    otherState,
  )
})
