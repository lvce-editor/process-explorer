import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import { join2 } from '../Path/Path.ts'

// TODO figure out whether this uses too much memory (name,path -> redundant, depth could be computed on demand)
export const toDisplayDirent = (
  parentPath: string,
  parentDepth: number,
  rawDirentType: number,
  rawDirentName: string,
  index: number,
  length: number,
): ExplorerItem => {
  const path = join2(parentPath, rawDirentName)
  return {
    depth: parentDepth + 1,
    icon: '',
    name: rawDirentName,
    path, // TODO storing absolute path might be too costly, could also store relative path here
    posInSet: index + 1,
    selected: false,
    setSize: length,
    type: rawDirentType,
  }
}
