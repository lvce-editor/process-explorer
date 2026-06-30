import { expect, test } from '@jest/globals'
import * as FocusPrevious from '../src/parts/FocusPrevious/FocusPrevious.ts'
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'

test('focusPrevious', () => {
  const state = createProcessState({
    focusedIndex: 1,
  })
  expect(FocusPrevious.focusPrevious(state).focusedIndex).toBe(0)
})

test('focusPrevious focuses last item from -1', () => {
  const state = createProcessState({
    focusedIndex: -1,
  })
  expect(FocusPrevious.focusPrevious(state).focusedIndex).toBe(2)
})

test('focusPrevious returns state at beginning or empty list', () => {
  const state = createProcessState({
    focusedIndex: 0,
  })
  expect(FocusPrevious.focusPrevious(state)).toBe(state)

  const emptyState = createProcessState({
    focusedIndex: -1,
    visibleProcesses: [],
  })
  expect(FocusPrevious.focusPrevious(emptyState)).toBe(emptyState)
})
