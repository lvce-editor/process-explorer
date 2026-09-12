import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'

export const focusFirst = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  const { visibleProcesses } = state
  if (visibleProcesses.length === 0) {
    return state
  }
  return FocusIndex.focusIndex(state, 0)
}
