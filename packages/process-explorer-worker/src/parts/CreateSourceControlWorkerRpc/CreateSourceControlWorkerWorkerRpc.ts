import { type Rpc, LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { VError } from '@lvce-editor/verror'

const send = (port: MessagePort): Promise<void> => {
  // @ts-ignore
  return RendererWorker.sendMessagePortToSourceControlWorker(port, 0)
}

export const createSourceControlWorkerRpc = async (): Promise<Rpc> => {
  try {
    const rpc = await LazyTransferMessagePortRpcParent.create({
      commandMap: {},
      send,
    })
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create source control worker rpc`)
  }
}
