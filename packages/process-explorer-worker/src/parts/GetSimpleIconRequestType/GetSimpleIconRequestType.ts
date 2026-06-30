import * as DirentType from '../DirentType/DirentType.ts'

export const getSimpleIconRequestType = (direntType: number): 1 | 2 => {
  if ([DirentType.Directory, DirentType.DirectoryExpanded, DirentType.EditingDirectoryExpanded, DirentType.EditingFolder].includes(direntType)) {
    return 2
  }
  return 1
}
