import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import type { IconRequest } from '../IconRequest/IconRequest.ts'

const getMissingDirents = (dirents: readonly ExplorerItem[], fileIconCache: FileIconCache): readonly ExplorerItem[] => {
  const missingDirents: ExplorerItem[] = []
  for (const dirent of dirents) {
    if (!(dirent.path in fileIconCache)) {
      missingDirents.push(dirent)
    }
  }
  return missingDirents
}

const toIconRequest = (dirent: ExplorerItem): IconRequest => {
  return {
    name: dirent.name,
    path: dirent.path,
    type: dirent.type,
  }
}

export const getMissingIconRequests = (dirents: readonly ExplorerItem[], fileIconCache: FileIconCache): readonly IconRequest[] => {
  const missingRequests = getMissingDirents(dirents, fileIconCache)
  const iconRequests = missingRequests.map(toIconRequest)
  return iconRequests
}
