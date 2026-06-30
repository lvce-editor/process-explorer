import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getExpandedDirents } from '../GetExpandedDirents/GetExpandedDirents.ts'
import { getPathDirentsMap } from '../GetPathDirentsMap/GetPathDirentsMap.ts'
import { getPaths } from '../GetPaths/GetPaths.ts'
import { getProtoMap } from '../GetProtoMap/GetProtoMap.ts'
import { sortPathDirentsMap } from '../SortPathDirentsMap/SortPathDirentsMap.ts'

export const refresh = async (state: ExplorerState): Promise<ExplorerState> => {
  const { focusedIndex, items, root } = state
  const expandedDirents = getExpandedDirents(items)
  const expandedPaths = getPaths(expandedDirents)
  const allPaths = [root, ...expandedPaths]
  const pathToDirents = await getPathDirentsMap(allPaths)
  const sortedPathDirents = sortPathDirentsMap(pathToDirents)
  const newItems = getProtoMap(root, sortedPathDirents, expandedPaths)
  let newFocusedIndex = focusedIndex
  if (focusedIndex >= newItems.length) {
    newFocusedIndex = newItems.length - 1
  }
  return {
    ...state,
    focusedIndex: newFocusedIndex,
    items: newItems,
  }
}
