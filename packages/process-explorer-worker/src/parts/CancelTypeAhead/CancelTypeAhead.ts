import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const cancelTypeAhead = (state: ExplorerState): ExplorerState => {
  return {
    ...state,
    focusWord: '',
  }
}
