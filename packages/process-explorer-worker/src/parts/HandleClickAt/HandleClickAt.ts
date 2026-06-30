import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as GetIndexFromPosition from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleClickAtRangeSelection from '../HandleClickAtRangeSelection/HandleClickAtRangeSelection.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'
import { toggleIndividualSelection } from '../ToggleIndividualSelection/ToggleIndividualSelection.ts'

export const handleClickAt = async (
  state: ExplorerState,
  defaultPrevented: boolean,
  button: number,
  ctrlKey: boolean,
  shiftKey: boolean,
  eventX: number,
  eventY: number,
): Promise<ExplorerState> => {
  if (defaultPrevented || button !== MouseEventType.LeftClick) {
    return state
  }
  const index = GetIndexFromPosition.getIndexFromPosition(state, eventX, eventY)
  if (index === -1 || index >= state.items.length) {
    return FocusIndex.focusIndex(state, -1)
  }
  if (shiftKey) {
    return HandleClickAtRangeSelection.handleClickAtRangeSelection(state, index)
  }
  if (ctrlKey) {
    return toggleIndividualSelection(state, index)
  }
  return HandleClick.handleClick(state, index)
}
