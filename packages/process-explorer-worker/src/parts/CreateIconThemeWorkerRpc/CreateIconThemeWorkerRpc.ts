import { type Rpc, LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { VError } from '@lvce-editor/verror'

const send = (port: MessagePort): Promise<void> => {
  return RendererWorker.sendMessagePortToIconThemeWorker(port, 0)
}

export const createIconThemeWorkerRpc = async (): Promise<Rpc> => {
  try {
    const rpc = await LazyTransferMessagePortRpcParent.create({
      commandMap: {},
      send,
    })
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create icon theme worker rpc`)
  }
}
