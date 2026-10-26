export interface ProcessInfo {
  readonly cmd: string
  readonly memory: number
  readonly name: string
  readonly parentTreeId: number | string
  readonly pid: number
  readonly ppid: number
  readonly source: 'local' | 'remote'
  readonly synthetic: boolean
  readonly treeId: number | string
}
