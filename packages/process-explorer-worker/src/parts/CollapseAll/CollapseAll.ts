import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as GetVisibleProcesses from '../GetVisibleProcesses/GetVisibleProcesses.ts'

export const collapseAll = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  const parentPids = new Set<number>()
  for (const process of state.processes) {
    parentPids.add(process.ppid)
  }
  const collapsedPids = state.processes
    .filter((process) => parentPids.has(process.pid))
    .map((process) => process.pid)
  const visibleProcesses = GetVisibleProcesses.getVisibleProcesses(
    state.processes,
    collapsedPids,
    state.rootPid,
  )
  return {
    ...state,
    collapsedPids,
    focusedIndex: visibleProcesses.length === 0 ? -1 : 0,
    visibleProcesses,
  }
}
