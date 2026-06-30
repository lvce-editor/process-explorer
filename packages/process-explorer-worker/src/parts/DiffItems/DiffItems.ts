import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const isEqual = (
  oldState: ProcessExplorerState,
  newState: ProcessExplorerState,
): boolean => {
  return (
    oldState.initial === newState.initial &&
    oldState.errorMessage === newState.errorMessage &&
    oldState.visibleProcesses === newState.visibleProcesses
  )
}
