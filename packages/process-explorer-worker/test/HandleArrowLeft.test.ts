import { expect, test } from '@jest/globals'
import * as HandleArrowLeft from '../src/parts/HandleArrowLeft/HandleArrowLeft.ts'
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'

test('handleArrowLeft collapses expanded process', () => {
  const state = createProcessState({
    focusedIndex: 1,
  })
  const result = HandleArrowLeft.handleArrowLeft(state)
  expect(result.collapsedPids).toEqual([2])
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([1, 2])
})

test('handleArrowLeft focuses parent for leaf', () => {
  const state = createProcessState({
    focusedIndex: 2,
  })
  expect(HandleArrowLeft.handleArrowLeft(state).focusedIndex).toBe(1)
})

test('handleArrowLeft returns state without focused process', () => {
  const state = createProcessState({
    focusedIndex: 99,
  })
  expect(HandleArrowLeft.handleArrowLeft(state)).toBe(state)
})

test('handleArrowLeft returns state when focused process has no parent', () => {
  const processes = [
    {
      cmd: 'main',
      memory: 1,
      name: 'main',
      pid: 1,
      ppid: 0,
    },
  ]
  const state = createProcessState({
    focusedIndex: 0,
    processes,
  })
  expect(HandleArrowLeft.handleArrowLeft(state)).toBe(state)
})
