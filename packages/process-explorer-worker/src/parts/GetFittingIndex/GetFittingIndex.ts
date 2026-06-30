import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'

const isFolder = (direntType: number): boolean => {
  return [DirentType.Directory, DirentType.DirectoryExpanded, DirentType.SymLinkFolder].includes(direntType)
}

export const getFittingIndex = (dirents: readonly ExplorerItem[], startIndex: number): number => {
  for (let i = startIndex; i >= 0; i--) {
    const dirent = dirents[i]
    if (dirent && isFolder(dirent.type)) {
      return i
    }
  }
  return -1
}
