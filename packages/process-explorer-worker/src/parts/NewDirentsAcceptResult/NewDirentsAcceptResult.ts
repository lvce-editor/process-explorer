import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export interface NewDirentsAcceptResult {
  readonly dirents: readonly ExplorerItem[]
  readonly newFocusedIndex: number
}
