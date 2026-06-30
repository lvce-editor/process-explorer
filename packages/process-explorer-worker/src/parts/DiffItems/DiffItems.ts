import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const isEqual = (
  oldState: ProcessExplorerState,
  newState: ProcessExplorerState,
): boolean => {
  return (
    oldState.initial === newState.initial &&
    oldState.errorCodeFrame === newState.errorCodeFrame &&
    oldState.errorMessage === newState.errorMessage &&
    oldState.errorStack === newState.errorStack &&
    oldState.visibleProcesses === newState.visibleProcesses
  )
}
