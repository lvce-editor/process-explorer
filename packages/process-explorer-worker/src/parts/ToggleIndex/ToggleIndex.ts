import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as GetVisibleProcesses from '../GetVisibleProcesses/GetVisibleProcesses.ts'
import * as ProcessFlag from '../ProcessFlag/ProcessFlag.ts'

export const toggleIndex = (
  state: ProcessExplorerState,
  index: number,
): ProcessExplorerState => {
  const process = state.visibleProcesses[index]
  if (!process || process.flags === ProcessFlag.None) {
    return state
  }
  const treeId = process.treeId ?? process.pid
  const collapsedPids = state.collapsedPids.includes(treeId)
    ? state.collapsedPids.filter((pid) => pid !== treeId)
    : [...state.collapsedPids, treeId]
  const visibleProcesses = GetVisibleProcesses.getVisibleProcesses(
    state.processes,
    collapsedPids,
    state.rootPid,
  )
  return {
    ...state,
    collapsedPids,
    focusedIndex: Math.min(index, visibleProcesses.length - 1),
    visibleProcesses,
  }
}
