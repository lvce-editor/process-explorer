import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ExpandAll from '../src/parts/ExpandAll/ExpandAll.ts'

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

test('expandAll clears collapsed pids', () => {
  const state = {
    ...createDefaultState(),
    collapsedPids: [1, 2],
    processes,
    rootPid: 1,
  }
  expect(ExpandAll.expandAll(state).collapsedPids).toEqual([])
})
