import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as GetVisibleProcesses from '../GetVisibleProcesses/GetVisibleProcesses.ts'

export const collapseAll = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  const { processes, rootPid } = state
  const parentPids = new Set<number | string>()
  for (const process of processes) {
    parentPids.add(process.parentTreeId ?? process.ppid)
  }
  const collapsedPids = processes
    .filter((process) => parentPids.has(process.treeId ?? process.pid))
    .map((process) => process.treeId ?? process.pid)
  const visibleProcesses = GetVisibleProcesses.getVisibleProcesses(
    processes,
    collapsedPids,
    rootPid,
  )
  return {
    ...state,
    collapsedPids,
    focusedIndex: visibleProcesses.length === 0 ? -1 : 0,
    visibleProcesses,
  }
}
