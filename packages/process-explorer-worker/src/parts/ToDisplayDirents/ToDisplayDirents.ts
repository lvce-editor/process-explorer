import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as SortExplorerItems from '../SortExplorerItems/SortExplorerItems.ts'
import { toDisplayDirent } from '../ToDisplayDirent/ToDisplayDirent.ts'

export const toDisplayDirents = (
  pathSeparator: string,
  rawDirents: readonly RawDirent[],
  parentDirentPath: string,
  parentDirentDepth: number,
  excluded: readonly string[],
  expanded: boolean = false,
): readonly ExplorerItem[] => {
  rawDirents = SortExplorerItems.sortExplorerItems(rawDirents)
  const result: ExplorerItem[] = []
  const visibleItems = rawDirents.filter((item) => !excluded.includes(item.name))
  const count = visibleItems.length
  for (let i = 0; i < visibleItems.length; i++) {
    const rawDirent = visibleItems[i]
    result.push(toDisplayDirent(parentDirentPath, parentDirentDepth, rawDirent.type, rawDirent.name, i, count))
  }
  return result
}
