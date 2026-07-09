import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as AutoRefresh from '../AutoRefresh/AutoRefresh.ts'

export const setUpdateInterval = (
  state: ProcessExplorerState,
  updateInterval: number,
): ProcessExplorerState => {
  AutoRefresh.restart(state.uid, updateInterval)
  return {
    ...state,
    updateInterval,
  }
}
