import { expect, test } from '@jest/globals'
import * as HandleArrowRight from '../src/parts/HandleArrowRight/HandleArrowRight.ts'
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'

test('handleArrowRight expands collapsed process', () => {
  const state = createProcessState({
    collapsedPids: [2],
    focusedIndex: 1,
  })
  const result = HandleArrowRight.handleArrowRight(state)
  expect(result.collapsedPids).toEqual([])
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([
    1, 2, 3,
  ])
})

test('handleArrowRight focuses first child for expanded process', () => {
  const state = createProcessState({
    focusedIndex: 0,
  })
  expect(HandleArrowRight.handleArrowRight(state).focusedIndex).toBe(1)
})

test('handleArrowRight returns state without focused process', () => {
  const state = createProcessState({
    focusedIndex: 99,
  })
  expect(HandleArrowRight.handleArrowRight(state)).toBe(state)
})

test('handleArrowRight returns state for leaf process', () => {
  const state = createProcessState({
    focusedIndex: 2,
  })
  expect(HandleArrowRight.handleArrowRight(state)).toBe(state)
})
