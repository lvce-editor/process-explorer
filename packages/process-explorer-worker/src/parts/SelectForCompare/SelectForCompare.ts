import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetFocusedFile from '../GetFocusedFile/GetFocusedFile.ts'

export const selectForCompare = (state: ExplorerState): ExplorerState => {
  const focusedFile = GetFocusedFile.getFocusedFile(state)
  if (!focusedFile) {
    return state
  }
  return {
    ...state,
    compareSourceUri: focusedFile.path,
  }
}
