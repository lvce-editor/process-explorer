import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const makeExpanded = (dirent: ExplorerItem): ExplorerItem => {
  if (dirent.type === DirentType.Directory) {
    return {
      ...dirent,
      type: DirentType.DirectoryExpanded,
    }
  }
  return dirent
}
