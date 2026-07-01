import { type Rpc, NodeWebSocketRpcClient } from '@lvce-editor/rpc'
import * as Assert from '../Assert/Assert.ts'
import * as GetCommandMap from '../GetCommandMap/GetCommandMap.ts'
import * as RequiresSocket from '../RequiresSocket/RequiresSocket.ts'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

interface CreateWebSocketRpc {
  (options: {
    readonly commandMap: Readonly<Record<string, any>>
    readonly handle: unknown
    readonly request: unknown
    readonly requiresSocket: typeof RequiresSocket.requiresSocket
  }): Promise<Rpc>
}

export const createWebSocketRpc = async (
  create: CreateWebSocketRpc,
  handle: unknown,
  request: unknown,
): Promise<Rpc> => {
  return create({
    commandMap: GetCommandMap.get(),
    handle,
    request,
    requiresSocket: RequiresSocket.requiresSocket,
  })
}

export const handleWebSocket = async (
  handle: unknown,
  request: unknown,
  rpcId?: number,
): Promise<void> => {
  Assert.object(handle)
  Assert.object(request)
  const rpc = await createWebSocketRpc(
    NodeWebSocketRpcClient.create,
    handle,
    request,
  )
  RpcRegistry.setRpc(rpc, rpcId)
}
