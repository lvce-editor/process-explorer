export const getFileHandleText = async (fileHandle: FileSystemFileHandle): Promise<string> => {
  const file = await fileHandle.getFile()
  const text = await file.text()
  return text
}
