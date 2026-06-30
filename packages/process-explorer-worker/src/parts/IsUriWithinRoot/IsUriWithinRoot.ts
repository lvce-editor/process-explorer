export const isUriWithinRoot = (root: string, uri: string, pathSeparator: string): boolean => {
  if (uri === root) {
    return true
  }
  const rootWithSeparator = root.endsWith(pathSeparator) ? root : `${root}${pathSeparator}`
  return uri.startsWith(rootWithSeparator)
}
