import { expect, test } from '@jest/globals'
import * as CollapseAll from '../src/parts/CollapseAll/CollapseAll.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import {
  createProcessState,
  processes,
} from './fixtures/ProcessExplorerFixtures.ts'

test('collapseAll collapses every parent process', () => {
  const state = createProcessState()
  const result = CollapseAll.collapseAll(state)
  expect(result.collapsedPids).toEqual([1, 2])
  expect(result.focusedIndex).toBe(0)
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([1])
})

test('collapseAll focuses nothing when no process is visible', () => {
  const state = {
    ...createDefaultState(),
    processes,
    rootPid: 99,
  }
  const result = CollapseAll.collapseAll(state)
  expect(result.collapsedPids).toEqual([1, 2])
  expect(result.focusedIndex).toBe(-1)
  expect(result.visibleProcesses).toEqual([])
})
