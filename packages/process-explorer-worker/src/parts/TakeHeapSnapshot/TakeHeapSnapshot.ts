import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.ts'
import * as RemoteProcessExplorer from '../RemoteProcessExplorer/RemoteProcessExplorer.ts'

export const takeHeapSnapshot = async (
  state: ProcessExplorerState,
  index?: number,
): Promise<ProcessExplorerState> => {
  const { focusedIndex, visibleProcesses } = state
  const process = visibleProcesses[index ?? focusedIndex]
  if (!process || process.synthetic) {
    return state
  }
  const processExplorer =
    process.source === 'remote' ? RemoteProcessExplorer : ProcessExplorer
  const path = await processExplorer.invoke(
    'Process.takeHeapSnapshot',
    process.pid,
    process.cmd,
  )
  await RendererWorker.invoke('Main.openUri', path)
  return state
}
