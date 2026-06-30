import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'

export const focusNext = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  if (state.focusedIndex >= state.visibleProcesses.length - 1) {
    return state
  }
  return FocusIndex.focusIndex(state, state.focusedIndex + 1)
}
