import * as DirentType from '../DirentType/DirentType.ts'

export const restoreDirentType = (rawDirentType: number, path: string, expandedPaths: readonly string[]): number => {
  if (rawDirentType === DirentType.Directory && expandedPaths.includes(path)) {
    return DirentType.DirectoryExpanded
  }
  return rawDirentType
}
