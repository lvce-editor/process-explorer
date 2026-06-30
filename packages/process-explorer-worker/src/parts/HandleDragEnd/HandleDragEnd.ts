import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const handleDragEnd = (state: ExplorerState): ExplorerState => {
  return {
    ...state,
    dropTargets: [],
  }
}
