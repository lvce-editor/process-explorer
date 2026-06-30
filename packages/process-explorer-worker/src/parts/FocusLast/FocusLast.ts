import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'

export const focusLast = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  if (state.visibleProcesses.length === 0) {
    return state
  }
  return FocusIndex.focusIndex(state, state.visibleProcesses.length - 1)
}
