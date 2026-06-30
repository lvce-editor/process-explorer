import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { handleContextMenuAtIndex } from '../HandleContextMenuAtIndex/HandleContextMenuAtIndex.ts'

export const handleContextMenuKeyboard = async (state: ExplorerState, index: number = state.focusedIndex): Promise<ExplorerState> => {
  const { itemHeight, minLineY, x, y } = state
  const menuX = x
  const menuY = y + (index - minLineY + 1) * itemHeight
  return handleContextMenuAtIndex(state, index, menuX, menuY)
}
