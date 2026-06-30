import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const toCollapsedDirent = (dirent: ExplorerItem): ExplorerItem => {
  if (dirent.type === DirentType.DirectoryExpanded) {
    return {
      ...dirent,
      type: DirentType.Directory,
    }
  }
  return dirent
}
