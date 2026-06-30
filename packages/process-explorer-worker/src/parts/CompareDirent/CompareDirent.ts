import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as Compare from '../Compare/Compare.ts'
import * as DirentType from '../DirentType/DirentType.ts'

const priorityMapFoldersFirst: Record<number, number> = {
  [DirentType.Directory]: 1,
  [DirentType.File]: 0,
  [DirentType.Socket]: 0,
  [DirentType.SymLinkFile]: 0,
  [DirentType.SymLinkFolder]: 1,
  [DirentType.Unknown]: 0,
}

const compareDirentType = (direntA: RawDirent, direntB: RawDirent): number => {
  return priorityMapFoldersFirst[direntB.type] - priorityMapFoldersFirst[direntA.type]
}

const compareDirentName = (direntA: RawDirent, direntB: RawDirent): number => {
  return Compare.compareStringNumeric(direntA.name, direntB.name)
}

export const compareDirent = (direntA: RawDirent, direntB: RawDirent): number => {
  return compareDirentType(direntA, direntB) || compareDirentName(direntA, direntB)
}
