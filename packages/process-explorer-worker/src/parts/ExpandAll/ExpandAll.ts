import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as GetVisibleProcesses from '../GetVisibleProcesses/GetVisibleProcesses.ts'

export const expandAll = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  const { processes, rootPid } = state
  const collapsedPids: readonly (number | string)[] = []
  const visibleProcesses = GetVisibleProcesses.getVisibleProcesses(
    processes,
    collapsedPids,
    rootPid,
  )
  return {
    ...state,
    collapsedPids,
    visibleProcesses,
  }
}
