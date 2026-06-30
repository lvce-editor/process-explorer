import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

// TODO select all should only select all items in the current folder
// and when calling it next item, expand selection to its parent folder
export const selectAll = (state: ExplorerState): ExplorerState => {
  const { items } = state
  const newItems = items.map((item) => ({
    ...item,
    selected: true,
  }))
  return {
    ...state,
    items: newItems,
  }
}
