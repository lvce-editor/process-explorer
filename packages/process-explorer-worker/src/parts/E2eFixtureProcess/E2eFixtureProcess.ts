import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.ts'

export const createE2eFixtureProcess = async (
  state: ProcessExplorerState,
  marker: string,
): Promise<ProcessExplorerState> => {
  const pid = await ProcessExplorer.invoke(
    'Process.createE2eFixtureProcess',
    marker,
  )
  return {
    ...state,
    rootPid: pid,
  }
}

export const disposeE2eFixtureProcess = async (
  _uid: number,
  pidOrMarker: number | string,
): Promise<void> => {
  await ProcessExplorer.invoke('Process.disposeE2eFixtureProcess', pidOrMarker)
}
