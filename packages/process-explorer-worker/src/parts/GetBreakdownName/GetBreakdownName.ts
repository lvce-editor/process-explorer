import type { MemoryBreakdownEntry } from '../MemoryBreakdownEntry/MemoryBreakdownEntry.ts'
import * as GetAttributionName from '../GetAttributionName/GetAttributionName.ts'

export const getBreakdownName = (
  entry: MemoryBreakdownEntry,
  index: number,
): string => {
  if (entry.attribution && entry.attribution.length > 0) {
    return entry.attribution
      .map(GetAttributionName.getAttributionName)
      .join(', ')
  }
  if (entry.types && entry.types.length > 0) {
    return entry.types.join(', ')
  }
  return `breakdown ${index + 1}`
}
