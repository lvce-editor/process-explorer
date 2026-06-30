import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetParentEndIndex from '../GetParentEndIndex/GetParentEndIndex.ts'

export const handleClickDirectoryExpanded = async (
  state: ExplorerState,
  dirent: ExplorerItem,
  index: number,
  keepFocus: boolean,
): Promise<ExplorerState> => {
  const { itemHeight, items, maxLineY, minLineY } = state
  // @ts-ignore
  dirent.type = DirentType.Directory
  // @ts-ignore
  dirent.icon = ''
  const endIndex = GetParentEndIndex.getParentEndIndex(items, index)
  const removeCount = endIndex - index - 1
  // TODO race conditions and side effects are everywhere
  const newDirents = [...items]
  newDirents.splice(index + 1, removeCount)
  const newTotal = newDirents.length
  if (newTotal < maxLineY) {
    const visibleItems = Math.min(maxLineY - minLineY, newTotal)
    const newMaxLineY = Math.min(maxLineY, newTotal)
    const newMinLineY = newMaxLineY - visibleItems
    const deltaY = newMinLineY * itemHeight
    return {
      ...state,
      deltaY,
      focused: keepFocus,
      focusedIndex: index,
      items: newDirents,
      maxLineY: newMaxLineY,
      minLineY: newMinLineY,
    }
  }
  return {
    ...state,
    focused: keepFocus,
    focusedIndex: index,
    items: newDirents,
  }
}
