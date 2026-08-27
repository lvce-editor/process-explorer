import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as AutoRefresh from '../AutoRefresh/AutoRefresh.ts'
import * as HandleProcessExplorerRpcClose from '../HandleProcessExplorerRpcClose/HandleProcessExplorerRpcClose.ts'
import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.ts'

export const killProcess = async (
  state: ProcessExplorerState,
  index: number = state.focusedIndex,
): Promise<ProcessExplorerState> => {
  const process = state.visibleProcesses[index]
  if (!process) {
    return state
  }
  const killPromise = ProcessExplorer.invoke('Process.kill', process.pid)
  if (process.name === 'process-explorer') {
    AutoRefresh.dispose(state.uid)
    void killPromise.catch(() => {})
    return HandleProcessExplorerRpcClose.toProcessExplorerRpcClosedState(state)
  }
  await killPromise
  return state
}
