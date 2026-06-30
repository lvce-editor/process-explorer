import { ViewletCommand } from '@lvce-editor/constants'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetExplorerVirtualDom from '../GetExplorerVirtualDom/GetExplorerVirtualDom.ts'
import * as GetLoadErrorMessage from '../GetLoadErrorMessage/GetLoadErrorMessage.ts'

export const renderItems = (oldState: ExplorerState, newState: ExplorerState): any => {
  const { dropTargets, editingErrorMessage, focused, focusedIndex, height, initial, itemHeight, items, root, width } = newState
  const visibleDirents = newState.visibleExplorerItems
  const isWide = width > 450
  const contentHeight = items.length * itemHeight
  const loadErrorMessage = GetLoadErrorMessage.getLoadErrorMessage(newState)
  const showOpenAnotherFolderButton = GetLoadErrorMessage.shouldShowOpenAnotherFolderButton(newState)
  if (initial) {
    return [ViewletCommand.SetDom2, newState.uid, []]
  }
  const dom = GetExplorerVirtualDom.getExplorerVirtualDom(
    visibleDirents,
    focusedIndex,
    root,
    isWide,
    focused,
    dropTargets,
    height,
    contentHeight,
    editingErrorMessage,
    loadErrorMessage,
    showOpenAnotherFolderButton,
  )
  return [ViewletCommand.SetDom2, newState.uid, dom]
}
