import { ViewletCommand, WhenExpression } from '@lvce-editor/constants'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const renderFocusContext = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  const { uid } = newState
  if (newState.focus === FocusId.Input) {
    return [ViewletCommand.SetFocusContext, uid, WhenExpression.FocusExplorerEditBox]
  }
  if (newState.focus === FocusId.List) {
    return [ViewletCommand.SetFocusContext, uid, WhenExpression.FocusExplorer]
  }
  return []
}
