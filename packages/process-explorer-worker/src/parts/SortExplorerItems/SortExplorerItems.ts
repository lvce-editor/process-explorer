import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'

export const sortExplorerItems = (rawDirents: readonly RawDirent[]): readonly RawDirent[] => {
  return rawDirents.toSorted(CompareDirent.compareDirent)
}
