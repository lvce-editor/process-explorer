import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const toggleIndividualSelection = async (state: ExplorerState, index: number): Promise<ExplorerState> => {
  const { items } = state

  // If index is out of range, do nothing
  if (index < 0 || index >= items.length) {
    return state
  }

  const newItems = items.map((item, i) => ({
    ...item,
    selected: i === index ? !item.selected : item.selected,
  }))

  return {
    ...state,
    items: newItems,
  }
}
