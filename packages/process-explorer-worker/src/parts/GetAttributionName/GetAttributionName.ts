import type { MemoryAttribution } from '../MemoryAttribution/MemoryAttribution.ts'
import * as GetUrlName from '../GetUrlName/GetUrlName.ts'

export const getAttributionName = (attribution: MemoryAttribution): string => {
  const scope = attribution.scope || 'memory'
  const url = attribution.url ? GetUrlName.getUrlName(attribution.url) : ''
  if (url) {
    return `${scope}: ${url}`
  }
  return scope
}
