import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const handleClickDirectoryExpanding = async (
  state: ExplorerState,
  dirent: ExplorerItem,
  index: number,
  keepFocus: boolean,
): Promise<ExplorerState> => {
  // @ts-ignore
  dirent.type = DirentType.Directory
  // @ts-ignore
  dirent.icon = ''
  return {
    ...state,
    focused: keepFocus,
    focusedIndex: index,
  }
}
