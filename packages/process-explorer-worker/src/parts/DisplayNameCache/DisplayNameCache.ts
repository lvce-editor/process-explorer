export interface DisplayNameCacheEntry {
  readonly name: string
  readonly usesPidMap: boolean
}

export interface DisplayNameCache {
  [cmd: string]: DisplayNameCacheEntry
}
