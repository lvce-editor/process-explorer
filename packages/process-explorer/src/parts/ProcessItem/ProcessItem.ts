export interface ProcessItem {
  readonly cmd: string
  readonly memory: number
  readonly name: string
  readonly pid: number
  readonly ppid: number
}

export interface ProcessItemWithDepth extends ProcessItem {
  readonly depth: number
}

export interface ParsedProcessItem {
  readonly cmd: string
  readonly depth: number
  readonly name: string
  readonly pid: number
  readonly ppid: number
}
