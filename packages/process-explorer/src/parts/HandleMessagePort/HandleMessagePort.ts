import { type Rpc, ElectronMessagePortRpcClient } from '@lvce-editor/rpc'
import * as Assert from '../Assert/Assert.ts'
import * as CommandMapRef from '../CommandMapRef/CommandMapRef.ts'
import * as RequiresSocket from '../RequiresSocket/RequiresSocket.ts'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

interface CreateMessagePortRpc {
  (options: {
    readonly commandMap: Readonly<Record<string, any>>
    readonly messagePort: unknown
    readonly requiresSocket: typeof RequiresSocket.requiresSocket
  }): Promise<Rpc>
}

export const createMessagePortRpc = async (
  create: CreateMessagePortRpc,
  messagePort: unknown,
): Promise<Rpc> => {
  return create({
    commandMap: CommandMapRef.get(),
    messagePort,
    requiresSocket: RequiresSocket.requiresSocket,
  })
}

export const handleMessagePort = async (
  messagePort: unknown,
  rpcId?: number,
): Promise<void> => {
  Assert.object(messagePort)
  const rpc = await createMessagePortRpc(
    ElectronMessagePortRpcClient.create,
    messagePort,
  )
  RpcRegistry.setRpc(rpc, rpcId)
}
