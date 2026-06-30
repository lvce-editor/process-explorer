import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as Arrays from '../Arrays/Arrays.ts'
import { focusIndex } from '../FocusIndex/FocusIndex.ts'

export const focusLast = (state: ExplorerState): ExplorerState => {
  const { focusedIndex, items } = state
  const lastIndex = Arrays.lastIndex(items)
  if (items.length === 0 || focusedIndex === lastIndex) {
    return state
  }
  return focusIndex(state, lastIndex)
}
