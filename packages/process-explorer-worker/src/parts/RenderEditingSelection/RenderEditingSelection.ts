import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { Renderer } from '../Renderer/Renderer.ts'
import * as InputName from '../InputName/InputName.ts'

export const renderEditingSelection: Renderer = (oldState: ExplorerState, newState: ExplorerState): any => {
  const { editingSelectionEnd, editingSelectionStart, uid } = newState
  return ['Viewlet.setSelectionByName', uid, InputName.ExplorerInput, editingSelectionStart, editingSelectionEnd]
}
