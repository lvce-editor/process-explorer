import { WebSocketRpcParent } from '@lvce-editor/rpc'
import * as Assert from '../Assert/Assert.ts'
import * as CreateSocketRpc from '../CreateSocketRpc/CreateSocketRpc.ts'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

export const { createSocketRpc } = CreateSocketRpc

export const handleSocket = async (
  webSocket: unknown,
  rpcId?: number,
): Promise<void> => {
  Assert.object(webSocket)
  const rpc = await CreateSocketRpc.createSocketRpc(
    WebSocketRpcParent.create,
    webSocket as Readonly<WebSocket>,
  )
  RpcRegistry.setRpc(rpc, rpcId)
}
