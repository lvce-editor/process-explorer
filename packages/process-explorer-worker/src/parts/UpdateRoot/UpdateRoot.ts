import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getTopLevelDirents } from '../GetTopLevelDirents/GetTopLevelDirents.ts'
import { mergeDirents } from '../MergeDirents/MergeDirents.ts'

// TODO add lots of tests for this
export const updateRoot = async (state1: ExplorerState): Promise<ExplorerState> => {
  // @ts-ignore
  if (state1.disposed) {
    return state1
  }
  // const file = nativeFiles.files[0]
  const topLevelDirents = await getTopLevelDirents(state1.root, state1.pathSeparator, [])
  // const state2 = Viewlet.getState('Explorer')
  // // TODO what if root changes while reading directories?
  // if (state2.disposed || state2.root !== state1.root) {
  //   return state2
  // }
  const newDirents = mergeDirents(state1.items, topLevelDirents)
  const state3 = {
    ...state1,
    items: newDirents,
  }
  return state3
}
