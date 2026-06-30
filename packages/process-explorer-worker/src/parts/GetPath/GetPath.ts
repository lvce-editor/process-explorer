import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const getPath = (item: ExplorerItem): string => {
  return item.path
}
