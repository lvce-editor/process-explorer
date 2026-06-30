import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const isEqual = (
  oldState: ProcessExplorerState,
  newState: ProcessExplorerState,
): boolean => {
  return (
    oldState.focused === newState.focused &&
    oldState.focusedIndex === newState.focusedIndex
  )
}
