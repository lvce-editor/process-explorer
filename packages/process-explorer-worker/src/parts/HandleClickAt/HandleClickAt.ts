import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'

export const handleClickAt = (
  state: ProcessExplorerState,
  index: number | string,
): ProcessExplorerState => {
  return FocusIndex.focusIndex(state, Number(index))
}
