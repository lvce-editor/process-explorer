import { ensureUri } from '../EnsureUris/EnsureUris.ts'

export const createDecorationMap = (decorations: readonly any[]): Record<string, string> => {
  const map: Record<string, string> = Object.create(null)
  for (const decoration of decorations) {
    const uri = ensureUri(decoration.uri)
    map[uri] = decoration.decoration
  }
  return map
}
