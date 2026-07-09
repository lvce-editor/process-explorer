import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ToggleIndex from '../ToggleIndex/ToggleIndex.ts'

export const handleDoubleClick = (
  state: ProcessExplorerState,
  index: number | string = state.focusedIndex,
): ProcessExplorerState => {
  return ToggleIndex.toggleIndex(state, Number(index))
}
