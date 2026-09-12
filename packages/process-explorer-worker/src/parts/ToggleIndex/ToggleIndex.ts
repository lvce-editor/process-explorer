import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as GetVisibleProcesses from '../GetVisibleProcesses/GetVisibleProcesses.ts'
import * as ProcessFlag from '../ProcessFlag/ProcessFlag.ts'

export const toggleIndex = (
  state: ProcessExplorerState,
  index: number,
): ProcessExplorerState => {
  const {
    collapsedPids: stateCollapsedPids,
    processes,
    rootPid,
    visibleProcesses: stateVisibleProcesses,
  } = state
  const process = stateVisibleProcesses[index]
  if (!process || process.flags === ProcessFlag.None) {
    return state
  }
  const treeId = process.treeId ?? process.pid
  const collapsedPids = stateCollapsedPids.includes(treeId)
    ? stateCollapsedPids.filter((pid) => pid !== treeId)
    : [...stateCollapsedPids, treeId]
  const visibleProcesses = GetVisibleProcesses.getVisibleProcesses(
    processes,
    collapsedPids,
    rootPid,
  )
  return {
    ...state,
    collapsedPids,
    focusedIndex: Math.min(index, visibleProcesses.length - 1),
    visibleProcesses,
  }
}
