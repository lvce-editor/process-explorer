import * as DirentType from '../DirentType/DirentType.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetSymlinkType from '../GetSymlinkType/GetSymlinkType.ts'
import * as IsSymbolicLink from '../IsSymbolicLink/IsSymbolicLink.ts'

// TODO maybe resolving of symbolic links should happen in shared process?
// so that there is less code and less work in the frontend
const resolveSymbolicLink = async (uri: string, rawDirent: any): Promise<any> => {
  try {
    // TODO support windows paths
    const absolutePath = uri + '/' + rawDirent.name
    const type = await FileSystem.stat(absolutePath)
    const symLinkType = GetSymlinkType.getSymlinkType(type)
    return {
      name: rawDirent.name,
      type: symLinkType,
    }
  } catch (error) {
    // @ts-ignore
    if (error && error.code === ErrorCodes.ENOENT) {
      return {
        name: rawDirent.name,
        type: DirentType.SymLinkFile,
      }
    }
    console.error(`Failed to resolve symbolic link for ${rawDirent.name}: ${error}`)
    return rawDirent
  }
}

export const resolveSymbolicLinks = async (uri: string, rawDirents: readonly any[]): Promise<any> => {
  const promises = []
  for (const rawDirent of rawDirents) {
    if (IsSymbolicLink.isSymbolicLink(rawDirent)) {
      const resolvedDirent = resolveSymbolicLink(uri, rawDirent)
      promises.push(resolvedDirent)
    } else {
      promises.push(rawDirent)
    }
  }
  const resolvedDirents = await Promise.all(promises)
  return resolvedDirents
}
