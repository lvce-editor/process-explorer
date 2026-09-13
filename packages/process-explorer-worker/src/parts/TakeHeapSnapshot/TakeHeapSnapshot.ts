import { MainProcess, RendererWorker } from '@lvce-editor/rpc-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as IsRendererProcess from '../IsRendererProcess/IsRendererProcess.ts'
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
  let path: string
  if (IsRendererProcess.isRendererProcess(process)) {
    path = await MainProcess.invoke('ElectronDeveloper.takeRendererHeapSnapshot', process.pid)
  } else {
    const processExplorer = process.source === 'remote' ? RemoteProcessExplorer : ProcessExplorer
    path = await processExplorer.invoke('Process.takeHeapSnapshot', process.pid, process.cmd)
  }
  await RendererWorker.invoke('Main.openUri', path)
  return state
}
