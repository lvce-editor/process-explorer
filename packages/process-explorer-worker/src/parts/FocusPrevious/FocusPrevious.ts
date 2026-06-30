import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as Arrays from '../Arrays/Arrays.ts'
import { focusIndex } from '../FocusIndex/FocusIndex.ts'

export const focusPrevious = (state: ExplorerState): ExplorerState => {
  const { focusedIndex, items } = state
  switch (focusedIndex) {
    case -1:
      if (items.length === 0) {
        return state
      }
      return focusIndex(state, Arrays.lastIndex(items))
    case 0:
      return state
    default:
      return focusIndex(state, focusedIndex - 1)
  }
}
