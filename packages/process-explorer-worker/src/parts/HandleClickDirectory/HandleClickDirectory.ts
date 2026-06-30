import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'

export const handleClickDirectory = async (state: ExplorerState, dirent: ExplorerItem, index: number, keepFocus: boolean): Promise<ExplorerState> => {
  // @ts-ignore
  dirent.type = DirentType.DirectoryExpanding
  // TODO handle error
  const dirents = await GetChildDirents.getChildDirents(state.pathSeparator, dirent.path, dirent.depth)
  const state2 = state
  if (!state2) {
    return state
  }
  // TODO use Viewlet.getState here and check if it exists
  const newIndex = state2.items.indexOf(dirent)
  // TODO if viewlet is disposed or root has changed, return
  if (newIndex === -1) {
    return state
  }
  const newDirents = [...state2.items]
  newDirents.splice(newIndex + 1, 0, ...dirents)
  // @ts-ignore
  dirent.type = DirentType.DirectoryExpanded
  // @ts-ignore
  dirent.icon = ''
  // TODO when focused index has changed while expanding, don't update it

  return {
    ...state,
    focus: FocusId.List,
    focused: keepFocus,
    focusedIndex: newIndex,
    items: newDirents,
  }
}
