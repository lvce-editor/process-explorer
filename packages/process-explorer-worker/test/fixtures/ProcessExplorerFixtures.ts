import { createDefaultState } from '../../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetVisibleProcesses from '../../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import type { ProcessExplorerState } from '../../src/parts/ProcessExplorerState/ProcessExplorerState.ts'
import type { ProcessInfo } from '../../src/parts/ProcessInfo/ProcessInfo.ts'

export const processes: readonly ProcessInfo[] = [
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

export const createVisibleProcesses = (
  collapsedPids: readonly number[] = [],
  rootPid: number = 1,
  items: readonly ProcessInfo[] = processes,
) => {
  return GetVisibleProcesses.getVisibleProcesses(items, collapsedPids, rootPid)
}

export const createProcessState = (
  overrides: Partial<ProcessExplorerState> = {},
): ProcessExplorerState => {
  const collapsedPids = overrides.collapsedPids ?? []
  const rootPid = overrides.rootPid ?? 1
  const items = overrides.processes ?? processes
  return {
    ...createDefaultState(),
    collapsedPids,
    processes: items,
    rootPid,
    visibleProcesses: createVisibleProcesses(collapsedPids, rootPid, items),
    ...overrides,
  }
}
