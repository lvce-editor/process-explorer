import type { Rpc } from '@lvce-editor/rpc'
import { RpcId } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import * as CommandMapRef from '../CommandMapRef/CommandMapRef.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

export const registerLaunchParentRpc = (rpc: Rpc): void => {
  RpcRegistry.setRpc(rpc, RpcId.SharedProcess)
}

export const listen = async (): Promise<void> => {
  CommandMapRef.set(CommandMap.commandMap)
  const rpc = await IpcChild.listen({
    commandMap: CommandMap.commandMap,
    method: IpcChildType.Auto(),
  })
  registerLaunchParentRpc(rpc)
}
