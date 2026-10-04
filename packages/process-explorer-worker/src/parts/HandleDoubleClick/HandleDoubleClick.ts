import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ToggleIndex from '../ToggleIndex/ToggleIndex.ts'

export const handleDoubleClick = (
  state: ProcessExplorerState,
  index: number | string | undefined = undefined,
): ProcessExplorerState => {
  const { focusedIndex } = state
  return ToggleIndex.toggleIndex(
    state,
    Number(index === undefined ? focusedIndex : index),
  )
}
