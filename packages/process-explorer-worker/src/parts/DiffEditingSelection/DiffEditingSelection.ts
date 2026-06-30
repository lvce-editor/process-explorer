import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { Selection } from '../Selection/Selection.ts'

export const diffEditingSelection = (state: ExplorerState, start: number, end: number): Selection | undefined => {
  const { editingSelectionEnd, editingSelectionStart } = state
  if (editingSelectionStart === start && editingSelectionEnd === end) {
    return undefined
  }
  return { end, start }
}
