import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { collapseAll } from '../CollapseAll/CollapseAll.ts'
import * as InputName from '../InputName/InputName.ts'
import { newFile } from '../NewFile/NewFile.ts'
import { newFolder } from '../NewFolder/NewFolder.ts'
import { refresh } from '../Refresh/Refresh.ts'

export const handleButtonClick = async (state: ExplorerState, name: string): Promise<ExplorerState> => {
  switch (name) {
    case InputName.CollapseAll:
      return collapseAll(state)
    case InputName.NewFile:
      return newFile(state)
    case InputName.NewFolder:
      return newFolder(state)
    case InputName.Refresh:
      return refresh(state)
    default:
      return state
  }
}
