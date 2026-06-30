import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import { getUnique } from '../GetUnique/GetUnique.ts'

const getIndent = (item: VisibleExplorerItem): number => item.indent

export const getUniqueIndents = (items: readonly VisibleExplorerItem[]): readonly number[] => {
  const indents = items.map(getIndent)
  const uniqueIndents = getUnique(indents)
  return uniqueIndents
}
