import { expect, test } from '@jest/globals'
import { MenuItemFlags } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetMenuEntries from '../src/parts/GetMenuEntries/GetMenuEntries.ts'
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
]

test('getMenuEntries - debuggable process', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  expect(GetMenuEntries.getMenuEntries(state)).toEqual([
    {
      args: [1],
      command: 'ProcessExplorer.killProcess',
      flags: MenuItemFlags.None,
      id: 'killProcess',
      label: 'Kill Process',
    },
    {
      args: [1],
      command: 'ProcessExplorer.debugProcess',
      flags: MenuItemFlags.None,
      id: 'debugProcess',
      label: 'Debug Process',
    },
  ])
})

test('getMenuEntries - normal process', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 2,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  expect(GetMenuEntries.getMenuEntries(state)).toEqual([
    {
      args: [2],
      command: 'ProcessExplorer.killProcess',
      flags: MenuItemFlags.None,
      id: 'killProcess',
      label: 'Kill Process',
    },
  ])
})

test('getMenuEntries - missing process', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 99,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  expect(GetMenuEntries.getMenuEntries(state)).toEqual([])
})
