import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const getFocusedIndexCancel = (items: readonly ExplorerItem[], editingIndex: number): number => {
  const newFocusedIndex = editingIndex >= items.length ? items.length - 1 : editingIndex
  return newFocusedIndex
}
