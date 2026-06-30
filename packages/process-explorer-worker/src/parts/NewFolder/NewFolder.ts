import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as NewDirent from '../NewDirent/NewDirent.ts'

export const newFolder = (state: ExplorerState): Promise<ExplorerState> => {
  return NewDirent.newDirent(state, ExplorerEditingType.CreateFolder)
}
