import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as Arrays from '../Arrays/Arrays.ts'
import { focusIndex } from '../FocusIndex/FocusIndex.ts'

export const focusNext = (state: ExplorerState): ExplorerState => {
  const { focusedIndex, items } = state
  if (focusedIndex === Arrays.lastIndex(items)) {
    return state
  }
  return focusIndex(state, focusedIndex + 1)
}
