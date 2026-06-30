import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ScrollInto from '../ScrollInto/ScrollInto.ts'

export const revealItemVisible = (state: ExplorerState, index: number): ExplorerState => {
  const { maxLineY, minLineY } = state
  const { newMaxLineY, newMinLineY } = ScrollInto.scrollInto(index, minLineY, maxLineY)
  return {
    ...state,
    focused: true,
    focusedIndex: index,
    maxLineY: newMaxLineY,
    minLineY: newMinLineY,
  }
}
