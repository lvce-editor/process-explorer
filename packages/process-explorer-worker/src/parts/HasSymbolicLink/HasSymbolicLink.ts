import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as IsSymbolicLink from '../IsSymbolicLink/IsSymbolicLink.ts'

export const hasSymbolicLinks = (rawDirents: readonly RawDirent[]): boolean => {
  return rawDirents.some(IsSymbolicLink.isSymbolicLink)
}
