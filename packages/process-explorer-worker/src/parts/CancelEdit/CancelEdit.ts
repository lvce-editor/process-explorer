import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { cancelEditInternal } from '../CancelEditInternal/CancelEditInternal.ts'

export const cancelEdit = async (state: ExplorerState): Promise<ExplorerState> => {
  return cancelEditInternal(state, true)
}
