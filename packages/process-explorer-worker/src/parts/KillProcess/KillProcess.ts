import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.ts'

export const killProcess = async (
  state: ProcessExplorerState,
  index: number = state.focusedIndex,
): Promise<ProcessExplorerState> => {
  const process = state.visibleProcesses[index]
  if (!process) {
    return state
  }
  await ProcessExplorer.invoke('Process.kill', process.pid)
  return state
}
