import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const setSelectedIndices = (state: ExplorerState, indices: number[]): ExplorerState => {
  const { items } = state
  const newItems = items.map((item, i) => ({
    ...item,
    selected: indices.includes(i),
  }))
  return {
    ...state,
    items: newItems,
  }
}
