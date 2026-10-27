import { expect, test } from '@jest/globals'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as ProcessFlag from '../src/parts/ProcessFlag/ProcessFlag.ts'

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

test('getVisibleProcesses', () => {
  const visible = GetVisibleProcesses.getVisibleProcesses(processes, [], 1)
  expect(visible.map((process) => process.pid)).toEqual([1, 2, 3])
  expect(visible.map((process) => process.depth)).toEqual([1, 2, 3])
  expect(visible.map((process) => process.flags)).toEqual([
    ProcessFlag.Expanded,
    ProcessFlag.Expanded,
    ProcessFlag.None,
  ])

  const collapsed = GetVisibleProcesses.getVisibleProcesses(processes, [2], 1)
  expect(collapsed.map((process) => process.pid)).toEqual([1, 2])
  expect(collapsed[1]).toMatchObject({
    flags: ProcessFlag.Collapsed,
    pid: 2,
  })
})

test('getVisibleProcesses - uses first process when root pid is missing', () => {
  const visible = GetVisibleProcesses.getVisibleProcesses(processes, [], 0)

  expect(visible.map((process) => process.pid)).toEqual([1, 2, 3])
})

test('getVisibleProcesses - missing root process', () => {
  expect(GetVisibleProcesses.getVisibleProcesses(processes, [], 99)).toEqual([])
})

test('getVisibleProcesses - returns no processes for an empty list', () => {
  expect(GetVisibleProcesses.getVisibleProcesses([], [], 0)).toEqual([])
})
