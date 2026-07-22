import type { Rpc } from '@lvce-editor/rpc'
import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { VError } from '@lvce-editor/verror'
import * as SendMessagePortToMainProcess from '../SendMessagePortToMainProcess/SendMessagePortToMainProcess.ts'

export const launchProcessExplorerElectron = async (): Promise<Rpc> => {
  try {
    const rpc = await LazyTransferMessagePortRpcParent.create({
      commandMap: {},
      send: SendMessagePortToMainProcess.sendMessagePortToMainProcess,
    })
    return rpc
  } catch (error) {
    throw new VError(error, 'Failed to create process explorer electron rpc')
  }
}
