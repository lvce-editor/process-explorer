import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as HandleRangeSelection from '../HandleRangeSelection/HandleRangeSelection.ts'

export const handleClickAtRangeSelection = async (state: ExplorerState, index: number): Promise<ExplorerState> => {
  const { items } = state
  const firstSelectedIndex = items.findIndex((item) => item.selected)
  if (firstSelectedIndex === -1) {
    return HandleRangeSelection.handleRangeSelection(state, index, index)
  }
  const min = Math.min(firstSelectedIndex, index)
  const max = Math.min(firstSelectedIndex, index)
  return HandleRangeSelection.handleRangeSelection(state, min, max)
}
