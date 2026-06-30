import { type Rpc, WebSocketRpcParent } from '@lvce-editor/rpc'
import * as Assert from '../Assert/Assert.ts'
import * as CommandMapRef from '../CommandMapRef/CommandMapRef.ts'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

interface CreateSocketRpc {
  (options: {
    readonly commandMap: Readonly<Record<string, any>>
    readonly webSocket: Readonly<WebSocket>
  }): Promise<Rpc>
}

export const createSocketRpc = async (
  create: CreateSocketRpc,
  webSocket: Readonly<WebSocket>,
): Promise<Rpc> => {
  return create({
    commandMap: CommandMapRef.get(),
    webSocket,
  })
}

export const handleSocket = async (
  webSocket: unknown,
  rpcId?: number,
): Promise<void> => {
  Assert.object(webSocket)
  const rpc = await createSocketRpc(
    WebSocketRpcParent.create,
    webSocket as Readonly<WebSocket>,
  )
  RpcRegistry.setRpc(rpc, rpcId)
}
