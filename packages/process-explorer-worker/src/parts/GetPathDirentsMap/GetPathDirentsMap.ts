import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'

export const getPathDirentsMap = async (allPaths: readonly string[]): Promise<Record<string, readonly RawDirent[]>> => {
  const pathToDirents: Record<string, readonly RawDirent[]> = Object.create(null)
  await Promise.all(
    allPaths.map(async (path) => {
      try {
        const dirents = await FileSystem.readDirWithFileTypes(path)
        pathToDirents[path] = dirents
      } catch {
        // ignore
      }
    }),
  )
  return pathToDirents
}
