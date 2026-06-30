import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as Assert from '../Assert/Assert.ts'
import { getChildDirentsRaw } from '../GetChildDirentsRaw/GetChildDirentsRaw.ts'
import * as ToDisplayDirents from '../ToDisplayDirents/ToDisplayDirents.ts'

export const getChildDirents = async (
  pathSeparator: string,
  parentDirentPath: string,
  parentDirentDepth: number,
  excluded: readonly string[] = [],
): Promise<readonly ExplorerItem[]> => {
  Assert.string(pathSeparator)
  // TODO use event/actor based code instead, this is impossible to cancel right now
  // also cancel updating when opening new folder
  // const dispose = state => state.pendingRequests.forEach(cancelRequest)
  // TODO should use FileSystem directly in this case because it is globally available anyway
  // and more typesafe than Command.execute
  // and more performant
  const rawDirents = await getChildDirentsRaw(parentDirentPath)
  const displayDirents = ToDisplayDirents.toDisplayDirents(pathSeparator, rawDirents, parentDirentPath, parentDirentDepth, excluded)
  return displayDirents
}
