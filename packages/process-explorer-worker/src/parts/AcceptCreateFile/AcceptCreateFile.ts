import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { acceptCreate } from '../AcceptCreate/AcceptCreate.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const acceptCreateFile = async (state: ExplorerState): Promise<ExplorerState> => {
  return acceptCreate(state, DirentType.File)
}
