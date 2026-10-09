import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'

export const focusNext = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  const { focusedIndex, visibleProcesses } = state
  if (focusedIndex >= visibleProcesses.length - 1) {
    return state
  }
  return FocusIndex.focusIndex(state, focusedIndex + 1)
}
