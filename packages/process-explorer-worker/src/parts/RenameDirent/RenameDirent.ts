import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { getNewDirentsForRename } from '../GetNewDirentsForRename/GetNewDirentsForRename.ts'
import { getRenameSelectionRange } from '../GetRenameSelectionRange/GetRenameSelectionRange.ts'
import * as InputSource from '../InputSource/InputSource.ts'

export const renameDirent = async (state: ExplorerState): Promise<ExplorerState> => {
  const { focusedIndex, icons, items, minLineY } = state
  if (items.length === 0) {
    return state
  }
  const item = items[focusedIndex]
  const newItems = getNewDirentsForRename(items, focusedIndex)
  const { end, start } = getRenameSelectionRange(item.name)
  return {
    ...state,
    editingIcon: icons[focusedIndex - minLineY],
    editingIndex: focusedIndex,
    editingSelectionEnd: end,
    editingSelectionStart: start,
    editingType: ExplorerEditingType.Rename,
    editingValue: item.name,
    focus: FocusId.Input,
    inputSource: InputSource.Script,
    items: newItems,
  }
}
