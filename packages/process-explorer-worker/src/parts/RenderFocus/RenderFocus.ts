import { ViewletCommand } from '@lvce-editor/constants'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as InputName from '../InputName/InputName.ts'
import * as InputSource from '../InputSource/InputSource.ts'

export const renderFocus = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  if (newState.inputSource === InputSource.User) {
    return []
  }
  if (newState.focus === FocusId.Input) {
    return [ViewletCommand.FocusElementByName, InputName.ExplorerInput]
  }
  if (newState.focus === FocusId.List) {
    return [ViewletCommand.FocusSelector, '.ListItems']
  }
  // TODO
  // 1. when focused, focus the outer list element
  // 2. when focused, set focus context in renderer worker
  return []
}
