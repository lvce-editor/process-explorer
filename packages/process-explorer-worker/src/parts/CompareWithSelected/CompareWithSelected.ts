import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetFocusedFile from '../GetFocusedFile/GetFocusedFile.ts'
import * as OpenDiff from '../OpenDiff/OpenDiff.ts'

export const compareWithSelected = async (state: ExplorerState): Promise<ExplorerState> => {
  const focusedFile = GetFocusedFile.getFocusedFile(state)
  if (!focusedFile) {
    return state
  }
  if (!state.compareSourceUri || state.compareSourceUri === focusedFile.path) {
    return state
  }
  await OpenDiff.openDiff(state.compareSourceUri, focusedFile.path, true)
  return {
    ...state,
    compareSourceUri: '',
  }
}
