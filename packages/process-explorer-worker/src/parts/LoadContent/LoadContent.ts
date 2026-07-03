import type { LoadContentResult } from '@lvce-editor/viewlet-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as AutoRefresh from '../AutoRefresh/AutoRefresh.ts'
import * as Refresh from '../Refresh/Refresh.ts'

const hasError = (state: ProcessExplorerState): boolean => {
  return Boolean(state.errorMessage || state.errorCodeFrame || state.errorStack)
}

export const loadContent = async (
  state: ProcessExplorerState,
): Promise<LoadContentResult<ProcessExplorerState>> => {
  const newState = await Refresh.refresh(state)
  if (!hasError(newState)) {
    AutoRefresh.start(newState.uid)
  }
  return {
    error: undefined,
    state: newState,
  }
}
