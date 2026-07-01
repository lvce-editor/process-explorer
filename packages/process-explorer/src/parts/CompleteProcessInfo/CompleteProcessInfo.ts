import type { IProcessCpuInfo } from '@vscode/windows-process-tree'

export type CompleteProcessInfo = Readonly<IProcessCpuInfo> & {
  readonly commandLine: string
  readonly memory: number
}
