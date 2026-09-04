declare module '@vscode/windows-process-tree' {
  export enum ProcessDataFlag {
    None = 0,
    Memory = 1,
    CommandLine = 2,
  }

  export interface IProcessInfo {
    readonly commandLine?: string
    readonly memory?: number
    readonly name: string
    readonly pid: number
    readonly ppid: number
  }

  export interface IProcessCpuInfo extends IProcessInfo {
    readonly cpu?: number
  }

  export function getProcessList(
    rootPid: number,
    callback: (processList: IProcessInfo[] | undefined) => void,
    flags?: ProcessDataFlag,
  ): void

  export function getProcessCpuUsage(
    processList: IProcessInfo[],
    callback: (processListWithCpu: IProcessCpuInfo[]) => void,
  ): void
}
