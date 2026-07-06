import { ElectronMessagePortRpcClient } from '@lvce-editor/rpc'
import * as Assert from '../Assert/Assert.ts'
import * as CreateMessagePortRpc from '../CreateMessagePortRpc/CreateMessagePortRpc.ts'
import * as HandleRpcClose from '../HandleRpcClose/HandleRpcClose.ts'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

export const { createMessagePortRpc } = CreateMessagePortRpc

export const handleMessagePort = async (
  messagePort: unknown,
  rpcId?: number,
): Promise<void> => {
  Assert.object(messagePort)
  const rpc = await CreateMessagePortRpc.createMessagePortRpc(
    ElectronMessagePortRpcClient.create,
    messagePort,
  )
  HandleRpcClose.listen(rpc)
  RpcRegistry.setRpc(rpc, rpcId)
}
