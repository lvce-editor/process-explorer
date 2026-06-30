import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const isNormalItem = (item: ExplorerItem): boolean => {
  return item.type !== DirentType.EditingFile && item.type !== DirentType.EditingFolder
}
