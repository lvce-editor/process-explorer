import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const handleEscape = async (state: ExplorerState): Promise<ExplorerState> => {
  return {
    ...state,
    cutItems: [],
  }
}
