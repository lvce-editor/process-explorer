import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.ts'

export const remove = async (dirent: string): Promise<void> => {
  return FileSystemWorker.invoke('FileSystem.remove', dirent)
}

export const readDirWithFileTypes = async (uri: string): Promise<readonly any[]> => {
  return FileSystemWorker.invoke('FileSystem.readDirWithFileTypes', uri)
}

export const getPathSeparator = async (root: string): Promise<string> => {
  return FileSystemWorker.invoke('FileSystem.getPathSeparator', root)
}

export const getRealPath = async (path: string): Promise<string> => {
  return FileSystemWorker.invoke('FileSystem.getRealPath', path)
}

export const stat = async (dirent: string): Promise<any> => {
  return FileSystemWorker.invoke('FileSystem.stat', dirent)
}

export const writeFile = async (uri: string, content: string): Promise<void> => {
  return FileSystemWorker.invoke('FileSystem.writeFile', uri, content)
}

export const mkdir = async (uri: string): Promise<void> => {
  return FileSystemWorker.invoke('FileSystem.mkdir', uri)
}

export const rename = async (oldUri: string, newUri: string): Promise<void> => {
  return FileSystemWorker.invoke('FileSystem.rename', oldUri, newUri)
}

export const copy = async (oldUri: string, newUri: string): Promise<void> => {
  return FileSystemWorker.invoke('FileSystem.copy', oldUri, newUri)
}
