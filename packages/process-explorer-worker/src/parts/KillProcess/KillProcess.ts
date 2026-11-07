import { PlatformType } from '@lvce-editor/constants'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as AutoRefresh from '../AutoRefresh/AutoRefresh.ts'
import * as HandleProcessExplorerRpcClose from '../HandleProcessExplorerRpcClose/HandleProcessExplorerRpcClose.ts'
import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.ts'
import * as RemoteProcessExplorer from '../RemoteProcessExplorer/RemoteProcessExplorer.ts'

export const killProcess = async (
  state: ProcessExplorerState,
  index: number | undefined = undefined,
): Promise<ProcessExplorerState> => {
  const { focusedIndex, platform, uid, visibleProcesses } = state
  const resolvedIndex = index === undefined ? focusedIndex : index
  const process = visibleProcesses[resolvedIndex]
  if (!process || process.synthetic) {
    return state
  }
  const processExplorer =
    process.source === 'remote' ? RemoteProcessExplorer : ProcessExplorer
  const killPromise = processExplorer.invoke('Process.kill', process.pid)
  if (process.name === 'process-explorer') {
    AutoRefresh.dispose(uid)
    void killPromise.catch(() => {})
    // Remote transports report the actual close. Showing retry before that event
    // can reconnect to the same process while it is still shutting down.
    if (platform === PlatformType.Remote) {
      return state
    }
    return HandleProcessExplorerRpcClose.toProcessExplorerRpcClosedState(state)
  }
  await killPromise
  return state
}
