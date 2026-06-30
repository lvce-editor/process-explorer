import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ScrollInto from '../ScrollInto/ScrollInto.ts'

export const adjustScrollAfterPaste = (state: ExplorerState, focusedIndex: number): ExplorerState => {
  const { itemHeight, maxLineY, minLineY } = state
  const { newMaxLineY, newMinLineY } = ScrollInto.scrollInto(focusedIndex, minLineY, maxLineY)
  const newDeltaY = newMinLineY * itemHeight

  return {
    ...state,
    deltaY: newDeltaY,
    focused: true,
    focusedIndex,
    maxLineY: newMaxLineY,
    minLineY: newMinLineY,
  }
}
