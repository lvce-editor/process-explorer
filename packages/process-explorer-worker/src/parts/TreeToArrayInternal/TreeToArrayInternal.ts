import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { Tree } from '../Tree/Tree.ts'
import { join2 } from '../Path/Path.ts'

export const treeToArrayInternal = (map: Tree, root: string, items: ExplorerItem[], path: string, depth: number): void => {
  const children = map[path]
  if (!children) {
    return
  }
  const count = children.length
  for (let i = 0; i < count; i++) {
    const child = children[i]
    const childPath = join2(path, child.name)
    const absolutePath = join2(root, childPath)
    items.push({
      depth,
      icon: '',
      name: child.name,
      path: absolutePath,
      posInSet: i + 1,
      selected: false,
      setSize: count,
      type: child.type,
    })
    treeToArrayInternal(map, root, items, childPath, depth + 1)
  }
}
