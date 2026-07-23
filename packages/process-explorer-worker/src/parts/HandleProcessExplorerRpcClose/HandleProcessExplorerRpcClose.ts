import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as AutoRefresh from '../AutoRefresh/AutoRefresh.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'

export const processExplorerRpcClosedMessage =
  'Process explorer RPC connection was closed'

export const handleProcessExplorerRpcClose = async (): Promise<void> => {
  let didUpdate = false
  for (const uid of ProcessExplorerStates.getKeys()) {
    const viewletState = ProcessExplorerStates.get(uid)
    if (!viewletState) {
      continue
    }
    AutoRefresh.dispose(uid)
    const { oldState, scheduledState } = viewletState
    ProcessExplorerStates.set(uid, oldState, {
      ...scheduledState,
      errorCodeFrame: '',
      errorMessage: processExplorerRpcClosedMessage,
      errorStack: '',
      initial: false,
    })
    didUpdate = true
  }
  if (didUpdate) {
    await RendererWorker.invoke('ProcessExplorer.rerender')
  }
}
