import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { focusIndex } from '../FocusIndex/FocusIndex.ts'

export const focusNone = (state: ExplorerState): ExplorerState => {
  const { focusedIndex } = state
  if (focusedIndex === -1) {
    return state
  }
  return focusIndex(state, -1)
}
