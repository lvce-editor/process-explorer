import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ToggleIndex from '../ToggleIndex/ToggleIndex.ts'

export const handleDoubleClick = (
  state: ProcessExplorerState,
  index: number = state.focusedIndex,
): ProcessExplorerState => {
  return ToggleIndex.toggleIndex(state, index)
}
