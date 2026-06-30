import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { getFocusedIndexCancel } from '../GetFocusedIndexCancel/GetFocusedIndexCancel.ts'
import { getNewDirentsForCancelRename } from '../GetNewDirentsForCancelRename/GetNewDirentsForCancelRename.ts'

export const cancelEditRename = (state: ExplorerState, keepFocus: boolean): ExplorerState => {
  const { editingIndex, items } = state
  const newItems = getNewDirentsForCancelRename(items, editingIndex)
  const newFocusedIndex = getFocusedIndexCancel(items, editingIndex)
  return {
    ...state,
    editingErrorMessage: '',
    editingIndex: -1,
    editingSelectionEnd: 0,
    editingSelectionStart: 0,
    editingType: ExplorerEditingType.None,
    editingValue: '',
    focus: FocusId.List,
    focused: keepFocus,
    focusedIndex: newFocusedIndex,
    items: newItems,
  }
}
