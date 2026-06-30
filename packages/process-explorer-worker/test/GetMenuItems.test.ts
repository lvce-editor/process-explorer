import { expect, test } from '@jest/globals'
import * as GetMenuItems from '../src/parts/GetMenuItems/GetMenuItems.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'

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

test('getMenuItems', () => {
  const visible = GetVisibleProcesses.getVisibleProcesses(processes, [], 1)
  expect(GetMenuItems.getMenuItems(visible[1])).toEqual([
    {
      label: 'Kill Process',
    },
    {
      label: 'Debug Process',
    },
  ])
  expect(GetMenuItems.getMenuItems(visible[2])).toEqual([
    {
      label: 'Kill Process',
    },
  ])
})
