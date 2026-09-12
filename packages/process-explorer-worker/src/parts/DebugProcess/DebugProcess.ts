import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const debugProcess = async (
  state: ProcessExplorerState,
  index: number | undefined = undefined,
): Promise<ProcessExplorerState> => {
  const { focusedIndex, visibleProcesses } = state
  const resolvedIndex = index === undefined ? focusedIndex : index
  const process = visibleProcesses[resolvedIndex]
  if (!process) {
    return state
  }
  await RendererWorker.invoke('AttachDebugger.attachDebugger', process.pid)
  return state
}
