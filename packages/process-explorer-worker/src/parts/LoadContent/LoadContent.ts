import type { LoadContentResult } from '@lvce-editor/viewlet-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as AutoRefresh from '../AutoRefresh/AutoRefresh.ts'
import * as Refresh from '../Refresh/Refresh.ts'

export const loadContent = async (
  state: ProcessExplorerState,
): Promise<LoadContentResult<ProcessExplorerState>> => {
  const newState = await Refresh.refresh(state)
  AutoRefresh.start(state.uid)
  return {
    error: undefined,
    state: newState,
  }
}
