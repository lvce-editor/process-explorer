import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const isEqual = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  return (
    oldState.items === newState.items &&
    oldState.minLineY === newState.minLineY &&
    oldState.maxLineY === newState.maxLineY &&
    oldState.focusedIndex === newState.focusedIndex &&
    oldState.editingIndex === newState.editingIndex &&
    oldState.editingType === newState.editingType &&
    oldState.editingValue === newState.editingValue &&
    oldState.editingErrorMessage === newState.editingErrorMessage &&
    oldState.hasError === newState.hasError &&
    oldState.errorMessage === newState.errorMessage &&
    oldState.errorCode === newState.errorCode &&
    oldState.width === newState.width &&
    oldState.focused === newState.focused &&
    oldState.dropTargets === newState.dropTargets &&
    oldState.icons === newState.icons &&
    oldState.cutItems === newState.cutItems &&
    oldState.visibleExplorerItems === newState.visibleExplorerItems
  )
}
