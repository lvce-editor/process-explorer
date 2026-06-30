import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const setDeltaY = async (state: ExplorerState, deltaY: number): Promise<ExplorerState> => {
  if (!Number.isFinite(deltaY)) {
    return state
  }
  const { height, itemHeight, items } = state
  if (deltaY < 0) {
    deltaY = 0
  } else if (deltaY > items.length * itemHeight - height) {
    deltaY = Math.max(items.length * itemHeight - height, 0)
  }
  if (state.deltaY === deltaY) {
    return state
  }
  const minLineY = Math.round(deltaY / itemHeight)
  const maxLineY = minLineY + Math.round(height / itemHeight)
  return {
    ...state,
    deltaY,
    maxLineY,
    minLineY,
  }
}
