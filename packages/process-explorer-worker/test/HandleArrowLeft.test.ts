import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as HandleArrowLeft from '../src/parts/HandleArrowLeft/HandleArrowLeft.ts'

const processes = [
  {
    cmd: 'main',
    memory: 1,
    name: 'main',
    pid: 1,
    ppid: 0,
  },
  {
    cmd: 'node child.js',
    memory: 1500,
    name: 'child',
    pid: 2,
    ppid: 1,
  },
  {
    cmd: 'leaf',
    memory: 2_500_000,
    name: 'leaf',
    pid: 3,
    ppid: 2,
  },
  {
    cmd: 'orphan',
    memory: 1,
    name: 'orphan',
    pid: 4,
    ppid: 999,
  },
]

test('handleArrowLeft collapses expanded process', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 1,
    processes,
    rootPid: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  const result = HandleArrowLeft.handleArrowLeft(state)
  expect(result.collapsedPids).toEqual([2])
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([1, 2])
})

test('handleArrowLeft focuses parent for leaf', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 2,
    processes,
    rootPid: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  expect(HandleArrowLeft.handleArrowLeft(state).focusedIndex).toBe(1)
})
