import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as GetEditingType from '../GetEditingType/GetEditingType.ts'

export const getNewDirentsForRename = (items: readonly ExplorerItem[], focusedIndex: number): readonly ExplorerItem[] => {
  const item = items[focusedIndex]
  const editingType = GetEditingType.getEditingType(item.type)
  return [
    ...items.slice(0, focusedIndex),
    {
      ...item,
      type: editingType,
    },
    ...items.slice(focusedIndex + 1),
  ]
}
