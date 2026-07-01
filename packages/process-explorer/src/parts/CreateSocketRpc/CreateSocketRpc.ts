import type { Rpc } from '@lvce-editor/rpc'
import * as CommandMap from '../GetCommandMap/GetCommandMap.ts'

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
    commandMap: CommandMap.get(),
    webSocket,
  })
}
