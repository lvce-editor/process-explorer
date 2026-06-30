export interface PathPart {
  readonly depth: number
  readonly expanded?: boolean
  readonly path: string
  readonly pathSeparator: string
  readonly root: string
}
