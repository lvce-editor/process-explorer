import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const canBeDroppedInto = (dirent: ExplorerItem): boolean => {
  if (!dirent) {
    return false
  }
  switch (dirent.type) {
    case DirentType.Directory:
    case DirentType.DirectoryExpanded:
    case DirentType.DirectoryExpanding:
      return true
    default:
      return false
  }
}
