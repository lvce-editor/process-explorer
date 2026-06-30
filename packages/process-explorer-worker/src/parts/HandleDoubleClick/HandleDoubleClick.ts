import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getIndexFromPosition } from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import { newFile } from '../NewFile/NewFile.ts'

export const handleDoubleClick = async (state: ExplorerState, eventX: number, eventY: number): Promise<ExplorerState> => {
  const index = getIndexFromPosition(state, eventX, eventY)
  if (index !== -1) {
    return state
  }
  return newFile(state)
}
