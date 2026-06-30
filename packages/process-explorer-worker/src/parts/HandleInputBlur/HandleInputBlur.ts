import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { acceptEdit } from '../AcceptEdit/AcceptEdit.ts'
import { cancelEditInternal } from '../CancelEditInternal/CancelEditInternal.ts'

export const handleInputBlur = async (state: ExplorerState): Promise<ExplorerState> => {
  const { editingErrorMessage, editingIndex, editingValue } = state
  if (editingIndex === -1) {
    return state
  }
  if (editingErrorMessage || !editingValue) {
    return cancelEditInternal(state, false)
  }
  return acceptEdit(state)
}
