import { expect, test } from '@jest/globals'
import * as FocusFirst from '../src/parts/FocusFirst/FocusFirst.ts'
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'

test('focusFirst focuses first visible process', () => {
  const state = createProcessState({
    focusedIndex: 2,
  })
  expect(FocusFirst.focusFirst(state).focusedIndex).toBe(0)
})

test('focusFirst returns state for empty visible processes', () => {
  const state = createProcessState({
    visibleProcesses: [],
  })
  expect(FocusFirst.focusFirst(state)).toBe(state)
})
