import * as DirentType from '../DirentType/DirentType.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'

export const getNewDirentType = (editingType: number): number => {
  switch (editingType) {
    case ExplorerEditingType.CreateFile:
      return DirentType.EditingFile
    case ExplorerEditingType.CreateFolder:
      return DirentType.EditingFolder
    default:
      return DirentType.File
  }
}
