import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'

export interface FileIconsResult {
  readonly icons: readonly string[]
  readonly newFileIconCache: FileIconCache
}
