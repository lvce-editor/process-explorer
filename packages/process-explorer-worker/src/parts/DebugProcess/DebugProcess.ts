import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const debugProcess = async (
  state: ProcessExplorerState,
  index: number = state.focusedIndex,
): Promise<ProcessExplorerState> => {
  const process = state.visibleProcesses[index]
  if (!process) {
    return state
  }
  await RendererWorker.invoke('AttachDebugger.attachDebugger', process.pid)
  return state
}
