import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

/**
 * Handles range selection in the explorer.
 * @param state The current explorer state
 * @param startIndex The starting index of the range (must be ≤ endIndex)
 * @param endIndex The ending index of the range (must be ≥ startIndex)
 * @throws Error if startIndex > endIndex
 */
export const handleRangeSelection = (state: ExplorerState, startIndex: number, endIndex: number): ExplorerState => {
  if (startIndex > endIndex) {
    throw new Error('startIndex must be less than or equal to endIndex')
  }

  const { items } = state
  const newItems = items.map((item, i) => ({
    ...item,
    selected: i >= startIndex && i <= endIndex ? true : item.selected,
  }))
  return {
    ...state,
    items: newItems,
  }
}
