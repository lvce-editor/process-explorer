import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import { getProtoMapInternal } from '../GetProtoMapInternal/GetProtoMapInternal.ts'

export const getProtoMap = (
  root: string,
  pathToDirents: Record<string, readonly RawDirent[]>,
  expandedPaths: readonly string[],
): readonly ExplorerItem[] => {
  return getProtoMapInternal(root, pathToDirents, expandedPaths, 1)
}
