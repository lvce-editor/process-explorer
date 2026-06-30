import { ViewletCommand, WhenExpression } from '@lvce-editor/constants'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const renderFocusContext = (
  oldState: ProcessExplorerState,
  newState: ProcessExplorerState,
): readonly any[] => {
  if (oldState.focused === newState.focused) {
    return []
  }
  return [
    ViewletCommand.SetFocusContext,
    newState.uid,
    newState.focused ? WhenExpression.FocusExplorer : WhenExpression.Empty,
  ]
}
