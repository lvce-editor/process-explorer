import * as ParentIpc from '../ParentIpc/ParentIpc.ts'

export const createPidMap = async () => {
  return ParentIpc.invoke('CreatePidMap.createPidMap')
}
