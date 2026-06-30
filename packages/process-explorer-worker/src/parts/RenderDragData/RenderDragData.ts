import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDragData } from '../GetDragData/GetDragData.ts'

export const renderDragData = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  const { focusedIndex, items, uid } = newState
  const selected = items.filter((item, index) => item.selected || index === focusedIndex)
  const urls = selected.map((item) => item.path)
  const dragData = getDragData(urls)
  return ['Viewlet.setDragData', uid, dragData]
}
