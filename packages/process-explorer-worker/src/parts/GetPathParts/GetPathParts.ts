import type { PathPart } from '../PathPart/PathPart.ts'

export const getPathParts = (root: string, uri: string, pathSeparator: string): readonly PathPart[] => {
  const parts: PathPart[] = []
  let index = root.length - 1
  let depth = 0
  while ((index = uri.indexOf(pathSeparator, index + 1)) !== -1) {
    const partUri = uri.slice(0, index)
    parts.push({
      depth: depth++,
      expanded: true,
      path: partUri,
      pathSeparator,
      root,
    })
  }
  return parts
}
