import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'

export const handleClickAt = (
  state: ProcessExplorerState,
  index: number,
): ProcessExplorerState => {
  return FocusIndex.focusIndex(state, index)
}
