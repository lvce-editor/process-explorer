import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { Tree } from '../Tree/Tree.ts'
import type { TreeItem } from '../TreeItem/TreeItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as Path from '../Path/Path.ts'

const getActualType = (type: number, expanded: boolean): number => {
  const actualType = type === DirentType.Directory && expanded ? DirentType.DirectoryExpanded : type
  return actualType
}

export const createTree = (items: readonly ExplorerItem[], root: string): Tree => {
  const tree: Record<string, TreeItem[]> = Object.create(null)
  const rootLength = root.length
  const paths = items.map((item) => {
    const relativePath = item.path.slice(rootLength)
    const dirname = Path.dirname2(relativePath)
    return dirname
  })
  for (const item of items) {
    const { name, path, type } = item
    const relativePath = path.slice(rootLength)
    const dirname = Path.dirname2(relativePath)
    const isExpanded = paths.includes(relativePath)
    const actualType = getActualType(type, isExpanded)
    tree[dirname] ||= []
    tree[dirname].push({
      name,
      type: actualType,
    })
  }
  return tree
}
