export interface ProcessInfo {
  readonly cmd: string
  readonly memory: number
  readonly name: string
  readonly pid: number
  readonly ppid: number
  readonly synthetic?: true
}
