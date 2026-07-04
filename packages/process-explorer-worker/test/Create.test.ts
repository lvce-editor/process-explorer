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
    uid: 7,
    width: 300,
    x: 1,
    y: 2,
  })
  expect(ProcessExplorerStates.get(7).newState).toBe(state)
})

test('create uses default asset dir', () => {
  ProcessExplorerStates.clear()
  const state = create(8, '', 1, 2, 300, 400, [], 5)
  expect(state.assetDir).toBe('')
  expect(state.uid).toBe(8)
})
