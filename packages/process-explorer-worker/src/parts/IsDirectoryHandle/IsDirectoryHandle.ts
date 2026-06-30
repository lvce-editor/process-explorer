export const isDirectoryHandle = (fileHandle: FileSystemHandle): fileHandle is FileSystemDirectoryHandle => {
  return fileHandle.kind === 'directory'
}
