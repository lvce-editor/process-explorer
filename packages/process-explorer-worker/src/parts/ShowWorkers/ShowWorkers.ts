import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as IsRendererProcess from '../IsRendererProcess/IsRendererProcess.ts'

export const showWorkers = async (
  state: ProcessExplorerState,
  index?: number,
): Promise<ProcessExplorerState> => {
  const { focusedIndex, visibleProcesses } = state
  const process = visibleProcesses[index ?? focusedIndex]
  if (
    !process ||
    process.synthetic ||
    !IsRendererProcess.isRendererProcess(process)
  ) {
    return state
  }
  await RendererWorker.invoke('Main.openUri', 'workers:///1')
  return state
}
