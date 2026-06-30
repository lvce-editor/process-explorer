import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { acceptCreateFile } from '../AcceptCreateFile/AcceptCreateFile.ts'
import { acceptCreateFolder } from '../AcceptCreateFolder/AcceptCreateFolder.ts'
import { acceptRename } from '../AcceptRename/AcceptRename.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'

export const acceptEdit = async (state: ExplorerState): Promise<ExplorerState> => {
  const { editingType } = state
  switch (editingType) {
    case ExplorerEditingType.CreateFile:
      return acceptCreateFile(state)
    case ExplorerEditingType.CreateFolder:
      return acceptCreateFolder(state)
    case ExplorerEditingType.Rename:
      return acceptRename(state)
    default:
      return state
  }
}
