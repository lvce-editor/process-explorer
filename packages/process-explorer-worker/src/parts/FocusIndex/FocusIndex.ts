import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const focusIndex = (
  state: ProcessExplorerState,
  index: number,
): ProcessExplorerState => {
  if (index < -1 || index >= state.visibleProcesses.length) {
    return state
  }
  return {
    ...state,
    focusedIndex: index,
  }
}
