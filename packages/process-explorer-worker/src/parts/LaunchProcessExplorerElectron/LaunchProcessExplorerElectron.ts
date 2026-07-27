import type { Rpc } from '@lvce-editor/rpc'
import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { VError } from '@lvce-editor/verror'
import * as SendMessagePortToMainProcess from '../SendMessagePortToMainProcess/SendMessagePortToMainProcess.ts'
import * as SendMessagePortToProcessExplorer from '../SendMessagePortToProcessExplorer/SendMessagePortToProcessExplorer.ts'

export interface ProcessExplorerElectronRpcs {
  readonly mainProcessRpc: Rpc
  readonly processExplorerRpc: Rpc
}

const createRpc = async (
  send: (port: MessagePort) => Promise<void>,
): Promise<Rpc> => {
  return LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send,
  })
}

export const launchProcessExplorerElectron =
  async (): Promise<ProcessExplorerElectronRpcs> => {
    let processExplorerRpc: Rpc | undefined
    try {
      processExplorerRpc = await createRpc(
        SendMessagePortToProcessExplorer.sendMessagePortToProcessExplorer,
      )
      const mainProcessRpc = await createRpc(
        SendMessagePortToMainProcess.sendMessagePortToMainProcess,
      )
      return {
        mainProcessRpc,
        processExplorerRpc,
      }
    } catch (error) {
      await processExplorerRpc?.dispose()
      throw new VError(error, 'Failed to create process explorer electron rpcs')
    }
  }
