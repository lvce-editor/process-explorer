import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as AutoRefresh from '../AutoRefresh/AutoRefresh.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'

export const processExplorerRpcClosedMessage =
  'Process explorer RPC connection was closed'

export const toProcessExplorerRpcClosedState = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  return {
    ...state,
    errorCodeFrame: '',
    errorMessage: processExplorerRpcClosedMessage,
    errorStack: '',
    initial: false,
  }
}

export const handleProcessExplorerRpcClose = async (): Promise<void> => {
  let didUpdate = false
  for (const uid of ProcessExplorerStates.getKeys()) {
    const viewletState = ProcessExplorerStates.get(uid)
    if (!viewletState) {
      continue
    }
    AutoRefresh.dispose(uid)
    const { oldState, scheduledState } = viewletState
    const newState = toProcessExplorerRpcClosedState(scheduledState)
    ProcessExplorerStates.set(uid, oldState, newState)
    didUpdate = true
  }
  if (didUpdate) {
    await RendererWorker.invoke('ProcessExplorer.rerender')
  }
}
