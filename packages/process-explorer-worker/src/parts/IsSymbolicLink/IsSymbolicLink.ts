import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const isSymbolicLink = (dirent: RawDirent): boolean => {
  return dirent.type === DirentType.Symlink
}
