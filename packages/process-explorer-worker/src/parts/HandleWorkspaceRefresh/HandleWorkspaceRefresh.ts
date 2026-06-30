import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { refresh } from '../Refresh/Refresh.ts'

export const handleWorkspaceRefresh = async (state: ExplorerState): Promise<ExplorerState> => {
  return refresh(state)
}
