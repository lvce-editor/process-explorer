import { expect, test } from '@jest/globals'
import * as ToggleIndex from '../src/parts/ToggleIndex/ToggleIndex.ts'
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'

test('toggleIndex collapses expanded process', () => {
  const state = createProcessState({
    focusedIndex: 1,
  })
  const result = ToggleIndex.toggleIndex(state, 1)
  expect(result.collapsedPids).toEqual([2])
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([1, 2])
})

test('toggleIndex expands collapsed process', () => {
  const state = createProcessState({
    collapsedPids: [2],
    focusedIndex: 1,
  })
  const result = ToggleIndex.toggleIndex(state, 1)
  expect(result.collapsedPids).toEqual([])
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([
    1, 2, 3,
  ])
})

test('toggleIndex returns state for invalid or leaf indexes', () => {
  const state = createProcessState()
  expect(ToggleIndex.toggleIndex(state, 10)).toBe(state)
  expect(ToggleIndex.toggleIndex(state, 2)).toBe(state)
})

test('toggleIndex clamps focus when visible processes shrink', () => {
  const state = createProcessState({
    focusedIndex: 2,
  })
  const result = ToggleIndex.toggleIndex(state, 0)
  expect(result.focusedIndex).toBe(0)
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([1])
})
