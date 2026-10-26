import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as HandleDoubleClick from '../src/parts/HandleDoubleClick/HandleDoubleClick.ts'

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

test('handleDoubleClick toggles process', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 0,
    processes,
    rootPid: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  expect(HandleDoubleClick.handleDoubleClick(state, 0).collapsedPids).toEqual([
    1,
  ])
})

test('handleDoubleClick - default index', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 0,
    processes,
    rootPid: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }

  expect(HandleDoubleClick.handleDoubleClick(state).collapsedPids).toEqual([1])
})

test('handleDoubleClick - string index', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 0,
    processes,
    rootPid: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }

  expect(HandleDoubleClick.handleDoubleClick(state, '0').collapsedPids).toEqual(
    [1],
  )
})
