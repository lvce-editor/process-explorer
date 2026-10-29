import { expect, test } from '@jest/globals'
import type { ProcessInfo } from '../src/parts/ProcessInfo/ProcessInfo.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as ReparentSharedProcessChildren from '../src/parts/ReparentSharedProcessChildren/ReparentSharedProcessChildren.ts'

const createProcess = (
  name: string,
  pid: number,
  ppid: number,
): ProcessInfo => ({
  cmd: name,
  memory: 1,
  name,
  parentTreeId: ppid,
  pid,
  ppid,
  source: 'local',
  synthetic: false,
  treeId: pid,
})

test('reparents conceptual children below the shared process', () => {
  const processes = [
    createProcess('main', 1, 0),
    createProcess('shared-process', 2, 1),
    createProcess('extension-builtin.remote-ssh:remote-SSH', 10, 1),
    createProcess('file-system-process', 3, 1),
    createProcess('file-watcher-process', 4, 1),
    createProcess('embeds-process', 5, 1),
    createProcess('process-explorer', 6, 1),
    createProcess('terminal-process', 7, 1),
    createProcess('bash', 8, 7),
    createProcess('extension-host', 9, 1),
  ]

  const result =
    ReparentSharedProcessChildren.reparentSharedProcessChildren(processes)

  expect(result.map((process) => process.ppid)).toEqual([
    0, 1, 2, 2, 2, 2, 2, 2, 7, 1,
  ])
  expect(result.map((process) => process.parentTreeId)).toEqual([
    0, 1, 2, 2, 2, 2, 2, 2, 7, 1,
  ])
})

test('remote ssh extension is nested under shared process with its ssh child', () => {
  const processes = [
    createProcess('main', 1, 0),
    createProcess('shared-process', 2, 1),
    createProcess('remote-ssh', 3, 1),
    createProcess('ssh', 4, 3),
    createProcess('extension-builtin.other:other', 5, 1),
  ]
  const reparented =
    ReparentSharedProcessChildren.reparentSharedProcessChildren(processes)

  const visible = GetVisibleProcesses.getVisibleProcesses(reparented, [], 1)
  expect(visible.map(({ depth, name }) => ({ depth, name }))).toEqual([
    { depth: 1, name: 'main' },
    { depth: 2, name: 'shared-process' },
    { depth: 3, name: 'remote-ssh' },
    { depth: 4, name: 'ssh' },
    { depth: 2, name: 'extension-builtin.other:other' },
  ])
  expect(
    GetVisibleProcesses.getVisibleProcesses(reparented, [2], 1).map(
      (process) => process.name,
    ),
  ).toEqual(['main', 'shared-process', 'extension-builtin.other:other'])
  expect(
    GetVisibleProcesses.getVisibleProcesses(reparented, [3], 1).map(
      (process) => process.name,
    ),
  ).toEqual([
    'main',
    'shared-process',
    'remote-ssh',
    'extension-builtin.other:other',
  ])
  expect(processes.map((process) => process.ppid)).toEqual([0, 1, 1, 3, 1])
})

test('returns the processes unchanged when there is no shared process', () => {
  const processes = [
    createProcess('main', 1, 0),
    createProcess('terminal-process', 2, 1),
  ]

  expect(
    ReparentSharedProcessChildren.reparentSharedProcessChildren(processes),
  ).toBe(processes)
})

test('search process is nested and collapses with shared process', () => {
  const processes = [
    createProcess('main', 1, 0),
    createProcess('shared-process', 2, 1),
    createProcess('search-process', 3, 1),
    createProcess('rg', 4, 3),
  ]
  const reparented =
    ReparentSharedProcessChildren.reparentSharedProcessChildren(processes)

  const visible = GetVisibleProcesses.getVisibleProcesses(reparented, [], 1)
  expect(visible.map(({ depth, name }) => ({ depth, name }))).toEqual([
    { depth: 1, name: 'main' },
    { depth: 2, name: 'shared-process' },
    { depth: 3, name: 'search-process' },
    { depth: 4, name: 'rg' },
  ])
  expect(
    GetVisibleProcesses.getVisibleProcesses(reparented, [2], 1).map(
      (process) => process.name,
    ),
  ).toEqual(['main', 'shared-process'])
  expect(processes[2].ppid).toBe(1)
})
