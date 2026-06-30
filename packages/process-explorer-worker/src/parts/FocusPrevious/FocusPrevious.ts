import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'

export const focusPrevious = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  if (state.focusedIndex === -1 && state.visibleProcesses.length > 0) {
    return FocusIndex.focusIndex(state, state.visibleProcesses.length - 1)
  }
  if (state.focusedIndex <= 0) {
    return state
  }
  return FocusIndex.focusIndex(state, state.focusedIndex - 1)
}
