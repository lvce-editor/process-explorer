import { MainProcess } from '@lvce-editor/rpc-registry'

export const createPidMap = async (): Promise<
  Readonly<Record<number, string>>
> => {
  return MainProcess.invoke('CreatePidMap.createPidMap')
}
