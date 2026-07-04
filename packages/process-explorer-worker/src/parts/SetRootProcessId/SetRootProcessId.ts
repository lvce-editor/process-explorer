import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const setRootProcessId = (
  state: ProcessExplorerState,
  rootPid: number,
): ProcessExplorerState => {
  return {
    ...state,
    rootPid,
  }
}
