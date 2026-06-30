import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const isExpanded = (item: ExplorerItem): boolean => {
  return item.type === DirentType.DirectoryExpanded || item.type === DirentType.DirectoryExpanding
}
