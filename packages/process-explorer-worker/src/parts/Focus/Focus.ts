import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const focus = (state: ExplorerState): ExplorerState => {
  if (state.focus) {
    return state
  }
  return {
    ...state,
    focus: FocusId.List,
  }
}
