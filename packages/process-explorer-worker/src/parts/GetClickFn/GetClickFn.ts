import type { ClickHandler } from '../ClickHandler/ClickHandler.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { ExplorerError } from '../ExplorerError/ExplorerError.ts'
import * as HandleClickDirectory from '../HandleClickDirectory/HandleClickDirectory.ts'
import * as HandleClickDirectoryExpanded from '../HandleClickDirectoryExpanded/HandleClickDirectoryExpanded.ts'
import * as HandleClickDirectoryExpanding from '../HandleClickDirectoryExpanding/HandleClickDirectoryExpanding.ts'
import * as HandleClickFile from '../HandleClickFile/HandleClickFile.ts'
import * as HandleClickSymlink from '../HandleClickSymlink/HandleClickSymlink.ts'
// TODO viewlet should only have create and refresh functions
// every thing else can be in a separate module <viewlet>.lazy.js
// and  <viewlet>.ipc.js

// viewlet: creating | refreshing | done | disposed
// TODO recycle viewlets (maybe)

// TODO instead of root string, there should be a root dirent

// TODO rename dirents to items, then can use virtual list component directly

// TODO support multiselection and removing multiple dirents

// TODO use posInSet and setSize properties to compute more effectively

// TODO much shared logic with newFolder

export const getClickFn = (direntType: number): ClickHandler => {
  switch (direntType) {
    case DirentType.Directory:
    case DirentType.SymLinkFolder:
      return HandleClickDirectory.handleClickDirectory
    case DirentType.DirectoryExpanded:
      return HandleClickDirectoryExpanded.handleClickDirectoryExpanded
    case DirentType.DirectoryExpanding:
      return HandleClickDirectoryExpanding.handleClickDirectoryExpanding
    case DirentType.File:
    case DirentType.SymLinkFile:
      return HandleClickFile.handleClickFile
    case DirentType.Symlink:
      return HandleClickSymlink.handleClickSymLink
    case DirentType.CharacterDevice:
      throw new ExplorerError('Cannot open character device files')
    case DirentType.BlockDevice:
      throw new ExplorerError('Cannot open block device files')
    case DirentType.Socket:
      throw new ExplorerError('Cannot open socket files')
    default:
      throw new ExplorerError(`unsupported dirent type ${direntType}`)
  }
}
