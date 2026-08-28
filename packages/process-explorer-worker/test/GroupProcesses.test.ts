import { expect, test } from '@jest/globals'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as GroupProcesses from '../src/parts/GroupProcesses/GroupProcesses.ts'

const localProcesses = [
  { cmd: 'local main', memory: 1, name: 'main', pid: 1, ppid: 0 },
  { cmd: 'local child', memory: 2, name: 'child', pid: 2, ppid: 1 },
]

const remoteProcesses = [
  { cmd: 'remote main', memory: 3, name: 'remote-main', pid: 1, ppid: 0 },
  { cmd: 'remote child', memory: 4, name: 'remote-child', pid: 2, ppid: 1 },
]

test('groupProcesses creates independent local and remote trees', () => {
  const processes = GroupProcesses.groupProcesses(
    localProcesses,
    1,
    remoteProcesses,
    1,
  )
  const visible = GetVisibleProcesses.getVisibleProcesses(processes, [], 1)

  expect(
    visible.map(({ depth, name, pid, source, treeId }) => ({
      depth,
      name,
      pid,
      source,
      treeId,
    })),
  ).toEqual([
    { depth: 1, name: 'Local', pid: 0, source: 'local', treeId: 'local:group' },
    { depth: 2, name: 'main', pid: 1, source: 'local', treeId: 'local:1' },
    { depth: 3, name: 'child', pid: 2, source: 'local', treeId: 'local:2' },
    {
      depth: 1,
      name: 'Remote',
      pid: 0,
      source: 'remote',
      treeId: 'remote:group',
    },
    {
      depth: 2,
      name: 'remote-main',
      pid: 1,
      source: 'remote',
      treeId: 'remote:1',
    },
    {
      depth: 3,
      name: 'remote-child',
      pid: 2,
      source: 'remote',
      treeId: 'remote:2',
    },
  ])
})

test('groupProcesses collapses one source without collapsing matching pids', () => {
  const processes = GroupProcesses.groupProcesses(
    localProcesses,
    1,
    remoteProcesses,
    1,
  )
  const visible = GetVisibleProcesses.getVisibleProcesses(
    processes,
    ['local:1'],
    1,
  )

  expect(visible.map((process) => process.treeId)).toEqual([
    'local:group',
    'local:1',
    'remote:group',
    'remote:1',
    'remote:2',
  ])
})
