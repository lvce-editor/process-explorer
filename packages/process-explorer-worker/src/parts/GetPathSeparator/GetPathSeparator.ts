import * as FileSystem from '../FileSystem/FileSystem.ts'

export const getPathSeparator = async (root: string): Promise<string> => {
  return FileSystem.getPathSeparator(root)
}
