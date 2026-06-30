import { expect, test } from '@jest/globals'
import * as FocusLast from '../src/parts/FocusLast/FocusLast.ts'
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'

test('focusLast focuses last visible process', () => {
  const state = createProcessState()
  expect(FocusLast.focusLast(state).focusedIndex).toBe(2)
})

test('focusLast returns state for empty visible processes', () => {
  const state = createProcessState({
    visibleProcesses: [],
  })
  expect(FocusLast.focusLast(state)).toBe(state)
})
