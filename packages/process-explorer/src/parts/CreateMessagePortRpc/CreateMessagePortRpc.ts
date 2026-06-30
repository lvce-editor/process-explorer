import { type Rpc } from '@lvce-editor/rpc'
import * as CommandMap from '../GetCommandMap/GetCommandMap.ts'
import * as RequiresSocket from '../RequiresSocket/RequiresSocket.ts'

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
    commandMap: CommandMap.get(),
    messagePort,
    requiresSocket: RequiresSocket.requiresSocket,
  })
}
