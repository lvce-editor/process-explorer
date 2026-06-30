import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as Assert from '../Assert/Assert.ts'
import { getIndexFromPosition } from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import { handleContextMenuAtIndex } from '../HandleContextMenuAtIndex/HandleContextMenuAtIndex.ts'

export const handleContextMenuMouseAt = async (state: ExplorerState, x: number, y: number): Promise<ExplorerState> => {
  Assert.number(x)
  Assert.number(y)
  const focusedIndex = getIndexFromPosition(state, x, y)
  return handleContextMenuAtIndex(state, focusedIndex, x, y)
}
