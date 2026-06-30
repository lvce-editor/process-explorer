export const isFileHandle = (fileHandle: FileSystemHandle): fileHandle is FileSystemFileHandle => {
  return fileHandle.kind === 'file'
}
