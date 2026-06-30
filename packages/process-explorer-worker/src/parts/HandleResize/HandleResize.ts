import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetExplorerMaxLineY from '../GetMaxLineY/GetMaxLineY.ts'
import * as GetScrollBarSize from '../GetScrollBarSize/GetScrollBarSize.ts'

export interface Dimensions {
  readonly height: number
  readonly width: number
}

export const handleResize = (state: ExplorerState, dimensions: Dimensions): ExplorerState => {
  const { height: rawHeight, width: rawWidth } = dimensions
  if (!Number.isFinite(rawHeight) || !Number.isFinite(rawWidth)) {
    return state
  }
  const height = Math.max(0, rawHeight)
  const width = Math.max(0, rawWidth)
  const { deltaY, itemHeight, items } = state
  const contentHeight = items.length * itemHeight
  const maxDeltaY = Math.max(contentHeight - height, 0)
  const newDeltaY = Math.min(Math.max(deltaY, 0), maxDeltaY)
  const minLineY = Math.round(newDeltaY / itemHeight)
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, items.length)
  const scrollBarHeight = GetScrollBarSize.getScrollBarSize(height, contentHeight, 20)
  if (
    state.height === height &&
    state.width === width &&
    state.deltaY === newDeltaY &&
    state.minLineY === minLineY &&
    state.maxLineY === maxLineY &&
    state.scrollBarHeight === scrollBarHeight
  ) {
    return state
  }
  return {
    ...state,
    deltaY: newDeltaY,
    height,
    maxLineY,
    minLineY,
    scrollBarHeight,
    width,
  }
}
