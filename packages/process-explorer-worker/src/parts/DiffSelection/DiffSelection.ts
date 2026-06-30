import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const isEqual = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  return oldState.editingSelectionStart === newState.editingSelectionStart && oldState.editingSelectionEnd === newState.editingSelectionEnd
}
