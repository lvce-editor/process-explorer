import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const getFocusedDirent = (state: ExplorerState): ExplorerItem | undefined => {
  const { focusedIndex, items, minLineY } = state
  const dirent = items[focusedIndex + minLineY]
  return dirent
}
