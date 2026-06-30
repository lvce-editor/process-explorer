import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FocusParentFolder from '../FocusParentFolder/FocusParentFolder.ts'
import * as HandleClickDirectoryExpanded from '../HandleClickDirectoryExpanded/HandleClickDirectoryExpanded.ts'

export const handleArrowLeft = (state: ExplorerState): ExplorerState | Promise<ExplorerState> => {
  const { focusedIndex, items } = state
  if (focusedIndex === -1) {
    return state
  }
  const dirent = items[focusedIndex]
  switch (dirent.type) {
    case DirentType.Directory:
    case DirentType.File:
    case DirentType.SymLinkFile:
      return FocusParentFolder.focusParentFolder(state)
    case DirentType.DirectoryExpanded:
      return HandleClickDirectoryExpanded.handleClickDirectoryExpanded(state, dirent, focusedIndex, true)
    default:
      // TODO handle expanding directory and cancel file system call to read child dirents
      return state
  }
}
