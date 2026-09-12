import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as ProcessFlag from '../ProcessFlag/ProcessFlag.ts'
import * as ToggleIndex from '../ToggleIndex/ToggleIndex.ts'

const getParentIndex = (state: ProcessExplorerState): number => {
  const { focusedIndex, visibleProcesses } = state
  const process = visibleProcesses[focusedIndex]
  if (!process) {
    return -1
  }
  for (let i = focusedIndex - 1; i >= 0; i--) {
    const otherProcess = visibleProcesses[i]
    if (otherProcess.depth === process.depth - 1) {
      return i
    }
  }
  return -1
}

export const handleArrowLeft = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  const { focusedIndex, visibleProcesses } = state
  const process = visibleProcesses[focusedIndex]
  if (!process) {
    return state
  }
  if (process.flags === ProcessFlag.Expanded) {
    return ToggleIndex.toggleIndex(state, focusedIndex)
  }
  const parentIndex = getParentIndex(state)
  if (parentIndex === -1) {
    return state
  }
  return FocusIndex.focusIndex(state, parentIndex)
}
