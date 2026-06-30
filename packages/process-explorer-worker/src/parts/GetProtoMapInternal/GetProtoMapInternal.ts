import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import { join2 } from '../Path/Path.ts'
import { restoreDirentType } from '../RestoreDirentType/RestoreDirentType.ts'

export const getProtoMapInternal = (
  root: string,
  pathToDirents: Record<string, readonly RawDirent[]>,
  expandedPaths: readonly string[],
  depth: number,
): readonly ExplorerItem[] => {
  if (!(root in pathToDirents)) {
    return []
  }
  const items = pathToDirents[root] || []
  const protoMap: ExplorerItem[] = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const path = join2(root, item.name)
    const displayDirent: ExplorerItem = {
      depth,
      icon: '',
      name: item.name,
      path,
      posInSet: i + 1,
      selected: false,
      setSize: items.length,
      type: restoreDirentType(item.type, path, expandedPaths),
    }
    const children = getProtoMapInternal(path, pathToDirents, expandedPaths, depth + 1)
    protoMap.push(displayDirent, ...children)
  }
  return protoMap
}
