import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getContainingFolder } from '../GetContainingFolder/GetContainingFolder.ts'
import { openNativeFolder } from '../OpenNativeFolder/OpenNativeFolder.ts'

export const openContainingFolder = async (state: ExplorerState): Promise<ExplorerState> => {
  const { focusedIndex, items, pathSeparator, root } = state
  const path = getContainingFolder(root, items, focusedIndex, pathSeparator)
  await openNativeFolder(path)
  return state
}
