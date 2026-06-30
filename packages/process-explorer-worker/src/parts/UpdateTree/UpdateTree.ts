import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const updateTree = (
  tree: Record<string, readonly any[]>,
  path: string,
  newDirents: readonly ExplorerItem[],
): Record<string, readonly ExplorerItem[]> => {
  const updatedTree = {
    ...tree,
    [path]: newDirents,
  }
  return updatedTree
}
