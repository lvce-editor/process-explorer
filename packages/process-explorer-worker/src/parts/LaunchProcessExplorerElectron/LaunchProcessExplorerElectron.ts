import type { Rpc } from '@lvce-editor/rpc'
import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { VError } from '@lvce-editor/verror'
import * as SendMessagePortToProcessExplorer from '../SendMessagePortToProcessExplorer/SendMessagePortToProcessExplorer.ts'

export const launchProcessExplorerElectron = async (): Promise<Rpc> => {
  try {
    const rpc = await LazyTransferMessagePortRpcParent.create({
      commandMap: {},
      send: SendMessagePortToProcessExplorer.sendMessagePortToProcessExplorer,
    })
    return rpc
  } catch (error) {
    throw new VError(error, 'Failed to create process explorer electron rpc')
  }
}
