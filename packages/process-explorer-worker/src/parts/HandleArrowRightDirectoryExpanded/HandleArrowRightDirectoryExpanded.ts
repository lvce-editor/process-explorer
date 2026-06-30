import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'

export const handleArrowRightDirectoryExpanded = (state: ExplorerState, dirent: any): ExplorerState => {
  const { focusedIndex, items } = state
  if (focusedIndex === items.length - 1) {
    return state
  }
  const nextDirent = items[focusedIndex + 1]
  if (nextDirent.depth === dirent.depth + 1) {
    return FocusIndex.focusIndex(state, focusedIndex + 1)
  }
  return state
}
