import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as GetParentStartIndex from '../GetParentStartIndex/GetParentStartIndex.ts'

export const focusParentFolder = (state: ExplorerState): ExplorerState => {
  const parentStartIndex = GetParentStartIndex.getParentStartIndex(state.items, state.focusedIndex)
  if (parentStartIndex === -1) {
    return state
  }
  return FocusIndex.focusIndex(state, parentStartIndex)
}
