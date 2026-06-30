import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const selectUp = (state: ExplorerState): ExplorerState => {
  const { focusedIndex, items } = state
  const firstSelectedIndex = items.findIndex((item) => item.selected)
  const targetIndex = firstSelectedIndex === -1 ? focusedIndex : firstSelectedIndex
  if (targetIndex <= 0) {
    return state
  }
  const newItems = items.map((item, i) => ({
    ...item,
    selected: i === targetIndex - 1 ? true : item.selected,
  }))
  return {
    ...state,
    items: newItems,
  }
}
