declare module '@vscode/windows-process-tree' {
  export interface IProcessInfo {
    commandLine?: string
    memory?: number
    name: string
    pid: number
    ppid: number
  }

  export interface IProcessCpuInfo extends IProcessInfo {
    cpu?: number
  }

  export function getProcessList(
    rootPid: number,
    callback: (processList: IProcessInfo[] | undefined) => void,
    flags?: number,
  ): void

  export function getProcessCpuUsage(
    processList: IProcessInfo[],
    callback: (processListWithCpu: IProcessCpuInfo[]) => void,
  ): void
}
