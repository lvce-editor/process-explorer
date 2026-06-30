import { getChildHandles } from '../GetChildHandles/GetChildHandles.ts'
import { getFileHandleText } from '../GetFileHandleText/GetFileHandleText.ts'
import { isDirectoryHandle } from '../IsDirectoryHandle/IsDirectoryHandle.ts'
import { isFileHandle } from '../IsFileHandle/IsFileHandle.ts'

export const createUploadTree = async (root: string, fileHandles: readonly FileSystemHandle[]): Promise<any> => {
  const uploadTree = Object.create(null)
  const normalized = fileHandles.filter(Boolean)
  for (const fileHandle of normalized) {
    const { name } = fileHandle
    if (isDirectoryHandle(fileHandle)) {
      const children = await getChildHandles(fileHandle)
      const childTree = await createUploadTree(name, children)
      uploadTree[name] = childTree
    } else if (isFileHandle(fileHandle)) {
      // TODO maybe save blob and use filesystem.writeblob
      const text = await getFileHandleText(fileHandle)
      uploadTree[name] = text
    }
  }
  return uploadTree
}
