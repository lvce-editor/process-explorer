import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const getSelectedItems = (items: readonly ExplorerItem[], focusedIndex: number): readonly ExplorerItem[] => {
  const dirent = items[focusedIndex]
  const selectedItems = items.filter((item) => item.selected || item === dirent)
  return selectedItems
}
