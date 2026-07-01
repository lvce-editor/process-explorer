import type { Rpc } from '@lvce-editor/rpc'
import { expect, jest, test } from '@jest/globals'
import * as CommandMapRef from '../src/parts/CommandMapRef/CommandMapRef.ts'
import * as HandleWebSocket from '../src/parts/HandleWebSocket/HandleWebSocket.ts'
import * as RequiresSocket from '../src/parts/RequiresSocket/RequiresSocket.ts'

const mockRpc: Rpc = {
  dispose: jest.fn(async () => {}),
  invoke: jest.fn(async () => {}),
  invokeAndTransfer: jest.fn(async () => {}),
  send: jest.fn(),
}
const create = jest.fn(async (_options: unknown) => mockRpc)

test('createWebSocketRpc', async () => {
  const commandMap = {
    test: jest.fn(),
  }
  const handle = {}
  const request = {}
  CommandMapRef.set(commandMap)

  await HandleWebSocket.createWebSocketRpc(create, handle, request)

  expect(create).toHaveBeenCalledWith({
    commandMap,
    handle,
    request,
    requiresSocket: RequiresSocket.requiresSocket,
  })
})
