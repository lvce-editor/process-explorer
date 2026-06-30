import type { TreeItem } from '../TreeItem/TreeItem.ts'

export interface Tree {
  readonly [key: string]: readonly TreeItem[]
}
