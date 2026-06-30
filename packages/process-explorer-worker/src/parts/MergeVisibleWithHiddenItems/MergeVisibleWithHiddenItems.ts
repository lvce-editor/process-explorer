import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const mergeVisibleWithHiddenItems = (visibleItems: readonly ExplorerItem[], hiddenItems: readonly ExplorerItem[]): readonly ExplorerItem[] => {
  const merged = [...visibleItems, ...hiddenItems]
  const seen = Object.create(null)
  const unique = []
  for (const item of merged) {
    if (seen[item.path]) {
      continue
    }
    seen[item.path] = true
    unique.push(item)
  }
  return unique
}
