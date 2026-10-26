export interface ProcessNamePattern {
  readonly matches: (cmd: string) => boolean
  readonly name: string
}
