import { expect, test } from '@jest/globals'
import * as CollapseAll from '../src/parts/CollapseAll/CollapseAll.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ExpandAll from '../src/parts/ExpandAll/ExpandAll.ts'

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

test('expandAll clears collapsed pids', () => {
  const state = {
    ...createDefaultState(),
    collapsedPids: [1, 2],
    processes,
    rootPid: 1,
  }
  expect(ExpandAll.expandAll(state).collapsedPids).toEqual([])
})

test('collapseAll collapses parent processes', () => {
  const state = {
    ...createDefaultState(),
    processes,
    rootPid: 1,
  }
  const result = CollapseAll.collapseAll(state)

  expect(result.collapsedPids).toEqual([1, 2])
  expect(result.focusedIndex).toBe(0)
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([1])
})

test('collapseAll - no visible processes', () => {
  const state = {
    ...createDefaultState(),
    processes: [],
    rootPid: 1,
  }
  const result = CollapseAll.collapseAll(state)

  expect(result.collapsedPids).toEqual([])
  expect(result.focusedIndex).toBe(-1)
  expect(result.visibleProcesses).toEqual([])
})
