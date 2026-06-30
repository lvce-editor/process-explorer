export interface NativeFilesResult {
  readonly files: readonly string[]
  readonly source: 'gnomeCopiedFiles'
  readonly type: 'none' | 'copy' | 'cut'
}
