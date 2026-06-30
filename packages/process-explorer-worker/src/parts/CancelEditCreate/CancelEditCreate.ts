import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { getFocusedIndexCancel } from '../GetFocusedIndexCancel/GetFocusedIndexCancel.ts'
import { isNormalItem } from '../IsNormalItem/IsNormalItem.ts'

export const cancelEditCreate = async (state: ExplorerState, keepFocus: boolean): Promise<ExplorerState> => {
  const { editingIndex, items } = state
  const filteredItems = items.filter(isNormalItem)
  const newFocusedIndex = getFocusedIndexCancel(filteredItems, editingIndex)
  return {
    ...state,
    editingErrorMessage: '',
    editingIndex: -1,
    editingType: ExplorerEditingType.None,
    editingValue: '',
    focus: FocusId.List,
    focused: keepFocus,
    focusedIndex: newFocusedIndex,
    items: filteredItems,
  }
}
