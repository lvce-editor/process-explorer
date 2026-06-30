import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as ProcessFlag from '../ProcessFlag/ProcessFlag.ts'
import * as ToggleIndex from '../ToggleIndex/ToggleIndex.ts'

const getParentIndex = (state: ProcessExplorerState): number => {
  const process = state.visibleProcesses[state.focusedIndex]
  if (!process) {
    return -1
  }
  for (let i = state.focusedIndex - 1; i >= 0; i--) {
    const otherProcess = state.visibleProcesses[i]
    if (otherProcess.depth === process.depth - 1) {
      return i
    }
  }
  return -1
}

export const handleArrowLeft = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  const process = state.visibleProcesses[state.focusedIndex]
  if (!process) {
    return state
  }
  if (process.flags === ProcessFlag.Expanded) {
    return ToggleIndex.toggleIndex(state, state.focusedIndex)
  }
  const parentIndex = getParentIndex(state)
  if (parentIndex === -1) {
    return state
  }
  return FocusIndex.focusIndex(state, parentIndex)
}
