import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { PathPart } from '../PathPart/PathPart.ts'
import { getChildDirents } from '../GetChildDirents/GetChildDirents.ts'
import { orderDirents } from '../OrderDirents/OrderDirents.ts'

const getPathPartChildren = async (pathPart: PathPart): Promise<readonly ExplorerItem[]> => {
  const children = await getChildDirents(pathPart.pathSeparator, pathPart.path, pathPart.depth)
  return children
}

export const getPathPartsChildren = async (pathparts: readonly PathPart[]): Promise<readonly ExplorerItem[]> => {
  const pathPartsChildren = await Promise.all(pathparts.map(getPathPartChildren))
  const pathPartsChildrenFlat = pathPartsChildren.flat()
  const orderedPathParts = orderDirents(pathPartsChildrenFlat)
  return orderedPathParts
}
