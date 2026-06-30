import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as GetFittingIndex from '../GetFittingIndex/GetFittingIndex.ts'
import * as GetNewDirentsForNewDirent from '../GetNewDirentsForNewDirent/GetNewDirentsForNewDirent.ts'
import * as GetNewDirentType from '../GetNewDirentType/GetNewDirentType.ts'

export const newDirent = async (state: ExplorerState, editingType: number): Promise<ExplorerState> => {
  // TODO do it like vscode, select position between folders and files
  const { editingIndex, focusedIndex, items, root } = state
  if (editingIndex !== -1) {
    return state
  }
  const index = GetFittingIndex.getFittingIndex(items, focusedIndex)
  const direntType = GetNewDirentType.getNewDirentType(editingType)
  const newDirents = await GetNewDirentsForNewDirent.getNewDirentsForNewDirent(items, index, direntType, root)
  const newEditingIndex = newDirents.findIndex((item) => item.type === DirentType.EditingFile || item.type === DirentType.EditingFolder)
  return {
    ...state,
    editingIndex: newEditingIndex,
    editingType,
    editingValue: '',
    focus: FocusId.Input,
    focusedIndex: newEditingIndex,
    items: newDirents,
  }
}
