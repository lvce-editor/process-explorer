import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const handleSelection = (state: ExplorerState, index: number): ExplorerState => {
  const { items } = state
  const newItems = items.map((item, i) => ({
    ...item,
    selected: i === index ? !item.selected : item.selected,
  }))
  return {
    ...state,
    items: newItems,
  }
}
