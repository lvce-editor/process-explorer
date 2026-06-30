import * as DirentType from '../DirentType/DirentType.ts'
import * as SortExplorerItems from '../SortExplorerItems/SortExplorerItems.ts'

export const getSavedChildDirents = (map: any, path: any, depth: any, excluded: any, pathSeparator: any): readonly any[] => {
  let children = map[path]
  if (!children) {
    return []
  }
  const dirents = []
  children = SortExplorerItems.sortExplorerItems(children)
  const visible = []
  const displayRoot = path.endsWith(pathSeparator) ? path : path + pathSeparator
  for (const child of children) {
    if (excluded.includes(child.name)) {
      continue
    }
    visible.push(child)
  }
  const visibleLength = visible.length
  for (let i = 0; i < visibleLength; i++) {
    const child = visible[i]
    const { name, type } = child
    const childPath = displayRoot + name
    if ((child.type === DirentType.Directory || child.type === DirentType.SymLinkFolder) && childPath in map) {
      dirents.push({
        depth,
        icon: '',
        name,
        path: childPath,
        posInSet: i + 1,
        setSize: visibleLength,
        type: DirentType.DirectoryExpanded,
      })
      dirents.push(...getSavedChildDirents(map, childPath, depth + 1, excluded, pathSeparator))
    } else {
      dirents.push({
        depth,
        icon: '',
        name,
        path: childPath,
        posInSet: i + 1,
        setSize: visibleLength,
        type,
      })
    }
  }
  return dirents
}
