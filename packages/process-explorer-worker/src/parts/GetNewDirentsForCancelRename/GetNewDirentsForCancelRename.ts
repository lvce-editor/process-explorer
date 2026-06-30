import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import { normalizeDirentType } from '../NormalizeDirentType/NormalizeDirentType.ts'

export const getNewDirentsForCancelRename = (items: readonly ExplorerItem[], editingIndex: number): readonly ExplorerItem[] => {
  const item = items[editingIndex]
  const newItems = [...items]
  newItems[editingIndex] = {
    ...item,
    type: normalizeDirentType(item.type),
  }
  return newItems
}
