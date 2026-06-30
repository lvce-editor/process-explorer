import { type Rpc, LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { VError } from '@lvce-editor/verror'
import * as SendMessagePortToErrorWorker from '../SendMessagePortToErrorWorker/SendMessagePortToErrorWorker.ts'

export const createErrorWorkerRpc = async (): Promise<Rpc> => {
  try {
    const rpc = await LazyTransferMessagePortRpcParent.create({
      commandMap: {},
      send: SendMessagePortToErrorWorker.sendMessagePortToErrorWorker,
    })
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create error worker rpc`)
  }
}
