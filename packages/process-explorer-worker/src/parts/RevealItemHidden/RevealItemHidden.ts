import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { getIndex } from '../GetIndex/GetIndex.ts'
import { getPathParts } from '../GetPathParts/GetPathParts.ts'
import { getPathPartsChildren } from '../GetPathPartsChildren/GetPathPartsChildren.ts'
import { getPathPartsToReveal } from '../GetPathPartsToReveal/GetPathPartsToReveal.ts'
import { mergeVisibleWithHiddenItems } from '../MergeVisibleWithHiddenItems/MergeVisibleWithHiddenItems.ts'
import { orderDirents } from '../OrderDirents/OrderDirents.ts'
import { scrollInto } from '../ScrollInto/ScrollInto.ts'

// TODO maybe just insert items into explorer and refresh whole explorer
export const revealItemHidden = async (state: ExplorerState, uri: string): Promise<ExplorerState> => {
  const { items, maxLineY, minLineY, pathSeparator, root } = state
  const pathParts = getPathParts(root, uri, pathSeparator)
  if (pathParts.length === 0) {
    return state
  }
  const pathPartsToReveal = getPathPartsToReveal(root, pathParts, items)
  const pathPartsChildren = await getPathPartsChildren(pathPartsToReveal)
  const pathPartsChildrenFlat = pathPartsChildren.flat()
  const orderedPathParts = orderDirents(pathPartsChildrenFlat)
  const mergedDirents = mergeVisibleWithHiddenItems(items, orderedPathParts)
  const expandedPaths = new Set(pathPartsToReveal.map((pathPart) => pathPart.path))
  const newDirents = mergedDirents.map((item) => {
    if (expandedPaths.has(item.path) && item.type === DirentType.Directory) {
      return {
        ...item,
        type: DirentType.DirectoryExpanded,
      }
    }
    return item
  })
  const index = getIndex(newDirents, uri)
  if (index === -1) {
    throw new Error(`File not found in explorer ${uri}`)
  }
  const { newMaxLineY, newMinLineY } = scrollInto(index, minLineY, maxLineY)
  return {
    ...state,
    focused: true,
    focusedIndex: index,
    items: newDirents,
    maxLineY: newMaxLineY,
    minLineY: newMinLineY,
  }
}
