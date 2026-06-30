import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as GetVisibleProcesses from '../GetVisibleProcesses/GetVisibleProcesses.ts'

export const expandAll = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  const collapsedPids: readonly number[] = []
  const visibleProcesses = GetVisibleProcesses.getVisibleProcesses(
    state.processes,
    collapsedPids,
    state.rootPid,
  )
  return {
    ...state,
    collapsedPids,
    visibleProcesses,
  }
}
