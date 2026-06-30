import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetFocusedDirent from '../GetFocusedDirent/GetFocusedDirent.ts'

export const copyPath = async (state: ExplorerState): Promise<ExplorerState> => {
  const dirent = GetFocusedDirent.getFocusedDirent(state)
  // TODO windows paths
  // TODO handle error
  const path = dirent ? dirent.path : state.root
  await RendererWorker.writeClipBoardText(path)
  return state
}
