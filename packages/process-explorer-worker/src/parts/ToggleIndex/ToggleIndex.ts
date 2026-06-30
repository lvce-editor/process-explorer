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
  const collapsedPids = state.collapsedPids.includes(process.pid)
    ? state.collapsedPids.filter((pid) => pid !== process.pid)
    : [...state.collapsedPids, process.pid]
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
