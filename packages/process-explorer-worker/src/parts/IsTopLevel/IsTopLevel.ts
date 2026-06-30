import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const isTopLevel = (dirent: ExplorerItem): boolean => {
  return dirent.depth === 1
}
