import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const isExpandedDirectory = (dirent: ExplorerItem): boolean => {
  return dirent.type === DirentType.DirectoryExpanded
}
