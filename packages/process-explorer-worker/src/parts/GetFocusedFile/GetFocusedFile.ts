import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const getFocusedFile = (state: ExplorerState): ExplorerItem | undefined => {
  if (state.focusedIndex < 0 || state.focusedIndex >= state.items.length) {
    return undefined
  }
  const item = state.items[state.focusedIndex]
  if (item.type !== DirentType.File) {
    return undefined
  }
  return item
}
