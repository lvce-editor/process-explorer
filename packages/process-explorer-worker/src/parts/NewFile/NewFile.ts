import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as NewDirent from '../NewDirent/NewDirent.ts'

// TODO much shared logic with newFolder
export const newFile = (state: ExplorerState): Promise<ExplorerState> => {
  return NewDirent.newDirent(state, ExplorerEditingType.CreateFile)
}
