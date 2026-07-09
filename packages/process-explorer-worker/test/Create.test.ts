import { expect, test } from '@jest/globals'
import { create } from '../src/parts/Create/Create.ts'
import * as ProcessExplorerStates from '../src/parts/ProcessExplorerStates/ProcessExplorerStates.ts'

test('create', () => {
  ProcessExplorerStates.clear()
  const state = create(7, '', 1, 2, 300, 400, [], 5, 0, '/asset')
  expect(state).toMatchObject({
    assetDir: '/asset',
    height: 400,
    initial: true,
    parentUid: 5,
    platform: 0,
    rootPid: -1,
    uid: 7,
    width: 300,
    x: 1,
    y: 2,
  })
  expect(ProcessExplorerStates.get(7).newState).toBe(state)
})

test('create - defaults and include frontend memory usage', () => {
  ProcessExplorerStates.clear()
  const state = create(
    8,
    '',
    1,
    2,
    300,
    400,
    { includeFrontendMemoryUsage: true },
    5,
  )
  expect(state).toMatchObject({
    assetDir: '',
    includeFrontendMemoryUsage: true,
    platform: 0,
    updateInterval: 1000,
  })
  expect(ProcessExplorerStates.get(8).newState).toBe(state)
})

test('create - update interval', () => {
  ProcessExplorerStates.clear()
  const state = create(10, '', 1, 2, 300, 400, { updateInterval: -1 }, 5)
  expect(state.updateInterval).toBe(-1)
})

test('create - missing args', () => {
  ProcessExplorerStates.clear()
  const state = create(9, '', 1, 2, 300, 400, undefined, 5)
  expect(state.includeFrontendMemoryUsage).toBe(false)
})
