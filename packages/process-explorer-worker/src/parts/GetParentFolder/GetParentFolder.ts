import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { dirname } from '../Path/Path.ts'

const isFileLike = (type: number): boolean => {
  return type === DirentType.File || type === DirentType.SymLinkFile
}

export const getParentFolder = (dirents: readonly ExplorerItem[], index: number, root: string, pathSeparator: string): string => {
  if (index < 0) {
    return root
  }
  const item = dirents[index]
  if (!item) {
    return root
  }
  if (isFileLike(item.type)) {
    const parentFolder = dirname(pathSeparator, item.path)
    return parentFolder || root
  }
  return item.path
}
