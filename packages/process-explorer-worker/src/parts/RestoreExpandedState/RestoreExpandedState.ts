import * as Character from '../Character/Character.ts'
import { getChildDirentsRaw } from '../GetChildDirentsRaw/GetChildDirentsRaw.ts'
import { getSavedChildDirents } from '../GetSavedChildDirents/GetSavedChildDirents.ts'
import * as PromiseStatus from '../PromiseStatus/PromiseStatus.ts'

const createDirents = (
  root: string,
  expandedDirentPaths: readonly string[],
  expandedDirentChildren: any,
  excluded: readonly string[],
  pathSeparator: string,
): readonly any[] => {
  const dirents = []
  const map = Object.create(null)
  for (let i = 0; i < expandedDirentPaths.length; i++) {
    const path = expandedDirentPaths[i]
    const children = expandedDirentChildren[i]
    if (children.status === PromiseStatus.Fulfilled) {
      map[path] = children.value
    }
  }
  dirents.push(...getSavedChildDirents(map, root, 1, excluded, pathSeparator))
  return dirents
}

const getSavedExpandedPaths = (savedState: any, root: string): any => {
  if (savedState && savedState.root !== root) {
    return []
  }
  if (savedState && savedState.expandedPaths && Array.isArray(savedState.expandedPaths)) {
    return savedState.expandedPaths
  }
  return []
}

export const restoreExpandedState = async (savedState: any, root: any, pathSeparator: any, excluded: any): Promise<any> => {
  // TODO read all opened folders in parallel
  // ignore ENOENT errors
  // ignore ENOTDIR errors
  // merge all dirents
  // restore scroll location
  const expandedPaths = getSavedExpandedPaths(savedState, root)
  if (root === Character.EmptyString) {
    return []
  }
  const expandedDirentPaths = [root, ...expandedPaths]
  const expandedDirentChildren = await Promise.allSettled(expandedDirentPaths.map(getChildDirentsRaw))
  if (expandedDirentChildren[0].status === PromiseStatus.Rejected) {
    throw expandedDirentChildren[0].reason
  }
  const dirents = createDirents(root, expandedDirentPaths, expandedDirentChildren, excluded, pathSeparator)
  return dirents
}
