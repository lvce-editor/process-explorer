import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as FocusNext from '../src/parts/FocusNext/FocusNext.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'

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

test('focusNext', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  expect(FocusNext.focusNext(state).focusedIndex).toBe(2)
  expect(FocusNext.focusNext({ ...state, focusedIndex: 2 })).toBeDefined()
})
