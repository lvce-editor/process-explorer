import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

const getLastSelectedIndex = (items: readonly ExplorerItem[]): number => {
  let lastSelectedIndex = -1
  for (let index = 0; index < items.length; index++) {
    if (items[index].selected) {
      lastSelectedIndex = index
    }
  }
  return lastSelectedIndex
}

export const selectDown = (state: ExplorerState): ExplorerState => {
  const { focusedIndex, items } = state
  const lastSelectedIndex = getLastSelectedIndex(items)
  const targetIndex = lastSelectedIndex === -1 ? focusedIndex : lastSelectedIndex
  if (targetIndex >= items.length - 1) {
    return state
  }
  const newItems = items.map((item, i) => ({
    ...item,
    selected: i === targetIndex + 1 ? true : item.selected || i === focusedIndex,
  }))
  return {
    ...state,
    focusedIndex: targetIndex + 1,
    items: newItems,
  }
}
