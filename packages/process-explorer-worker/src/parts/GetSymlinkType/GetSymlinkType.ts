import * as DirentType from '../DirentType/DirentType.ts'

export const getSymlinkType = (type: number): number => {
  switch (type) {
    case DirentType.Directory:
      return DirentType.SymLinkFolder
    case DirentType.File:
      return DirentType.SymLinkFile
    default:
      return DirentType.Symlink
  }
}
