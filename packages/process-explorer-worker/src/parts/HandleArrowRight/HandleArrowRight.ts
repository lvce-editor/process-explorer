import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as HandleArrowRightDirectoryExpanded from '../HandleArrowRightDirectoryExpanded/HandleArrowRightDirectoryExpanded.ts'
import * as HandleClickDirectory from '../HandleClickDirectory/HandleClickDirectory.ts'
import * as HandleClickSymlink from '../HandleClickSymlink/HandleClickSymlink.ts'

export const handleArrowRight = async (state: ExplorerState): Promise<ExplorerState> => {
  const { focusedIndex, items } = state
  if (focusedIndex === -1) {
    return state
  }
  const dirent = items[focusedIndex]
  switch (dirent.type) {
    case DirentType.Directory:
    case DirentType.SymLinkFolder:
      // @ts-ignore
      return HandleClickDirectory.handleClickDirectory(state, dirent, focusedIndex)
    case DirentType.DirectoryExpanded:
      return HandleArrowRightDirectoryExpanded.handleArrowRightDirectoryExpanded(state, dirent)
    case DirentType.File:
    case DirentType.SymLinkFile:
      return state
    case DirentType.Symlink:
      return HandleClickSymlink.handleClickSymLink(state, dirent, focusedIndex)
    default:
      throw new Error(`unsupported file type ${dirent.type}`)
  }
}
