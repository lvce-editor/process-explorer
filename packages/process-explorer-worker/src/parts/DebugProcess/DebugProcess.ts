import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.ts'
import * as RemoteProcessExplorer from '../RemoteProcessExplorer/RemoteProcessExplorer.ts'

export const debugProcess = async (
  state: ProcessExplorerState,
  index: number | undefined = undefined,
): Promise<ProcessExplorerState> => {
  const { focusedIndex, visibleProcesses } = state
  const resolvedIndex = index === undefined ? focusedIndex : index
  const process = visibleProcesses[resolvedIndex]
  if (!process || process.synthetic) {
    return state
  }
  const processExplorer =
    process.source === 'remote' ? RemoteProcessExplorer : ProcessExplorer
  const webSocketDebuggerUrl = await processExplorer.invoke(
    'Process.debugProcess',
    process.pid,
    process.cmd,
  )
  await RendererWorker.invoke(
    'AttachDebugger.attachDebugger',
    webSocketDebuggerUrl,
  )
  return state
}
