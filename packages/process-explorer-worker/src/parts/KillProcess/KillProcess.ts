import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as Signal from '../Signal/Signal.ts'

export const killProcess = async (
  state: ProcessExplorerState,
  index: number = state.focusedIndex,
): Promise<ProcessExplorerState> => {
  const process = state.visibleProcesses[index]
  if (!process) {
    return state
  }
  await RendererWorker.invoke('Process.kill', process.pid, Signal.SigTerm)
  return state
}
