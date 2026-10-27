import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as HandleArrowRight from '../src/parts/HandleArrowRight/HandleArrowRight.ts'

const processes = [
  {
    cmd: 'main',
    memory: 1,
    name: 'main',
    parentTreeId: 0,
    pid: 1,
    ppid: 0,
    source: 'local' as const,
    synthetic: false,
    treeId: 1,
  },
  {
    cmd: 'node child.js',
    memory: 1500,
    name: 'child',
    parentTreeId: 1,
    pid: 2,
    ppid: 1,
    source: 'local' as const,
    synthetic: false,
    treeId: 2,
  },
  {
    cmd: 'leaf',
    memory: 2_500_000,
    name: 'leaf',
    parentTreeId: 2,
    pid: 3,
    ppid: 2,
    source: 'local' as const,
    synthetic: false,
    treeId: 3,
  },
  {
    cmd: 'orphan',
    memory: 1,
    name: 'orphan',
    parentTreeId: 999,
    pid: 4,
    ppid: 999,
    source: 'local' as const,
    synthetic: false,
    treeId: 4,
  },
]

test('handleArrowRight expands collapsed process', () => {
  const state = {
    ...createDefaultState(),
    collapsedPids: [2],
    focusedIndex: 1,
    processes,
    rootPid: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(
      processes,
      [2],
      1,
    ),
  }
  const result = HandleArrowRight.handleArrowRight(state)
  expect(result.collapsedPids).toEqual([])
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([
    1, 2, 3,
  ])
})

test('handleArrowRight focuses first child for expanded process', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 0,
    processes,
    rootPid: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  expect(HandleArrowRight.handleArrowRight(state).focusedIndex).toBe(1)
})

test('handleArrowRight - missing focused process', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 99,
    processes,
    rootPid: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }

  expect(HandleArrowRight.handleArrowRight(state)).toBe(state)
})

test('handleArrowRight - leaf process', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 2,
    processes,
    rootPid: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }

  expect(HandleArrowRight.handleArrowRight(state)).toBe(state)
})
