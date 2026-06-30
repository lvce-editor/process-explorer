import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { getIndexFromPosition } from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'

export const handlePointerDown = (state: ExplorerState, button: number, x: number, y: number): ExplorerState => {
  const index = getIndexFromPosition(state, x, y)
  if (button === MouseEventType.LeftClick && index === -1) {
    return {
      ...state,
      focus: FocusId.List,
      focused: true,
      focusedIndex: -1,
    }
  }
  return state
}
