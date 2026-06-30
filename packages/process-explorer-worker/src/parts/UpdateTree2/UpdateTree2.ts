import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const updateTree2 = (
  tree: Record<string, readonly any[]>,
  update: Record<string, readonly any[]>,
): Record<string, readonly ExplorerItem[]> => {
  const updatedTree = {
    ...tree,
    ...update,
  }
  return updatedTree
}
