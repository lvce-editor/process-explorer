import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'

export const getIconsCached = (dirents: readonly string[], fileIconCache: FileIconCache): string[] => {
  return dirents.map((dirent) => fileIconCache[dirent])
}
