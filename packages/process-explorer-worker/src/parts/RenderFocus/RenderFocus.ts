import { ViewletCommand } from '@lvce-editor/constants'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const renderFocus = (
  oldState: ProcessExplorerState,
  newState: ProcessExplorerState,
): readonly any[] => {
  if (!newState.focused || oldState.focusedIndex === newState.focusedIndex) {
    return []
  }
  if (newState.focusedIndex < 0) {
    return [ViewletCommand.FocusSelector, '.ProcessExplorerTable']
  }
  return [
    ViewletCommand.FocusSelector,
    `[data-index="${newState.focusedIndex}"]`,
  ]
}
