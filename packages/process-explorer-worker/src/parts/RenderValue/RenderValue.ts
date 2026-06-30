import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as InputName from '../InputName/InputName.ts'
import * as InputSource from '../InputSource/InputSource.ts'

export const renderValue = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  if (newState.inputSource === InputSource.User) {
    return []
  }
  if (newState.focus === FocusId.Input) {
    return ['Viewlet.setValueByName', InputName.ExplorerInput, newState.editingValue]
  }
  return []
}
