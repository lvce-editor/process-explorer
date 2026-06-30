import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'

export const handleUpload = async (state: ExplorerState, dirents: readonly any[]): Promise<any> => {
  const { pathSeparator, root } = state
  for (const dirent of dirents) {
    // TODO switch
    // TODO symlink might not be possible to be copied
    // TODO create folder if type is 2
    if (dirent.type !== /* File */ 1) {
      continue
    }
    // TODO reading text might be inefficient for binary files
    // but not sure how else to send them via jsonrpc
    const content = await dirent.file.text()
    const absolutePath = [root, dirent.file.name].join(pathSeparator)
    await FileSystem.writeFile(absolutePath, content)
  }
}
