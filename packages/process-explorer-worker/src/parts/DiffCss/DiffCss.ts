import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const isEqual = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  // TODO compute css more optimized
  // maybe only when items change, and even then not
  // always, but only when it affects the css
  return (
    oldState.deltaY === newState.deltaY &&
    oldState.editingErrorMessage === newState.editingErrorMessage &&
    oldState.hasError === newState.hasError &&
    oldState.errorMessage === newState.errorMessage &&
    oldState.errorCode === newState.errorCode &&
    oldState.errorMessageLeft === newState.errorMessageLeft &&
    oldState.errorMessageTop === newState.errorMessageTop &&
    oldState.maxIndent === newState.maxIndent &&
    oldState.scrollBarActive === newState.scrollBarActive &&
    oldState.scrollBarHeight === newState.scrollBarHeight &&
    oldState.visibleExplorerItems === newState.visibleExplorerItems &&
    oldState.width === newState.width
  )
}
