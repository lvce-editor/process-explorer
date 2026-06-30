import * as Arrays from '../Arrays/Arrays.ts'

export const getChildHandles = async (fileHandle: FileSystemDirectoryHandle): Promise<readonly FileSystemHandle[]> => {
  // @ts-ignore
  const values = fileHandle.values()
  const children = await Arrays.fromAsync(values)
  return children
}
