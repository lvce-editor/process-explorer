import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetContextMenuHandler from '../GetContextMenuHandler/GetContextMenuHandler.ts'

export const handleContextMenu = async (state: ExplorerState, button: number, x: number, y: number): Promise<ExplorerState> => {
  const fn = GetContextMenuHandler.getContextMenuHandler(button)
  const newState = await fn(state, x, y)
  return newState
}
