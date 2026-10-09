import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'

export const focusPrevious = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  const { focusedIndex, visibleProcesses } = state
  if (focusedIndex === -1 && visibleProcesses.length > 0) {
    return FocusIndex.focusIndex(state, visibleProcesses.length - 1)
  }
  if (focusedIndex <= 0) {
    return state
  }
  return FocusIndex.focusIndex(state, focusedIndex - 1)
}
