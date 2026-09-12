import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const focusIndex = (
  state: ProcessExplorerState,
  index: number,
): ProcessExplorerState => {
  const { visibleProcesses } = state
  if (index < -1 || index >= visibleProcesses.length) {
    return state
  }
  return {
    ...state,
    focusedIndex: index,
  }
}
