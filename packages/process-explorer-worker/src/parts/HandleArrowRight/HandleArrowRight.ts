import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as ProcessFlag from '../ProcessFlag/ProcessFlag.ts'
import * as ToggleIndex from '../ToggleIndex/ToggleIndex.ts'

export const handleArrowRight = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  const { focusedIndex, visibleProcesses } = state
  const process = visibleProcesses[focusedIndex]
  if (!process) {
    return state
  }
  if (process.flags === ProcessFlag.Collapsed) {
    return ToggleIndex.toggleIndex(state, focusedIndex)
  }
  const nextProcess = visibleProcesses[focusedIndex + 1]
  if (
    process.flags === ProcessFlag.Expanded &&
    nextProcess &&
    nextProcess.depth > process.depth
  ) {
    return FocusIndex.focusIndex(state, focusedIndex + 1)
  }
  return state
}
