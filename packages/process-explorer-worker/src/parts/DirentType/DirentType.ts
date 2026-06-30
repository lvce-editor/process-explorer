import { DELTA_EDITING } from '../DeltaEditing/DeltaEditing.ts'

export const BlockDevice = 1
export const CharacterDevice = 2
export const Directory = 3
export const DirectoryExpanded = 4
export const DirectoryExpanding = 5
export const File = 7
export const Socket = 8
export const Symlink = 9
export const SymLinkFile = 10
export const SymLinkFolder = 11
export const Unknown = 12

export const EditingFile = File + DELTA_EDITING
export const EditingFolder = Directory + DELTA_EDITING
export const EditingDirectoryExpanded = DirectoryExpanded + DELTA_EDITING
