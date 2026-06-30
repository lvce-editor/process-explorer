export const getContainingFolder = (root: string, dirents: readonly any[], focusedIndex: number, pathSeparator: string): string => {
  if (focusedIndex < 0) {
    return root
  }
  const dirent = dirents[focusedIndex]
  const direntPath = dirent.path
  const direntParentPath = direntPath.slice(0, -(dirent.name.length + 1))
  const path = direntParentPath
  return path
}
