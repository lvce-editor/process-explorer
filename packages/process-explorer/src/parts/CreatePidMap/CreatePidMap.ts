import * as ParentIpc from '../ParentIpc/ParentIpc.ts'

export const createPidMap = async (): Promise<
  Readonly<Record<number, string>>
> => {
  return ParentIpc.invoke('CreatePidMap.createPidMap')
}
