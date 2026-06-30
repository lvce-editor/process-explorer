import { expect, test } from '@jest/globals'
import * as FocusIndex from '../src/parts/FocusIndex/FocusIndex.ts'
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'

test('focusIndex focuses valid index', () => {
  const state = createProcessState()
  expect(FocusIndex.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusIndex allows -1', () => {
  const state = createProcessState({
    focusedIndex: 1,
  })
  expect(FocusIndex.focusIndex(state, -1).focusedIndex).toBe(-1)
})

test('focusIndex ignores invalid indexes', () => {
  const state = createProcessState()
  expect(FocusIndex.focusIndex(state, -2)).toBe(state)
  expect(FocusIndex.focusIndex(state, state.visibleProcesses.length)).toBe(
    state,
  )
})
