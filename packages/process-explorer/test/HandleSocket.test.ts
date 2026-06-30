import type { Rpc } from '@lvce-editor/rpc'
import { expect, jest, test } from '@jest/globals'
import * as CommandMapRef from '../src/parts/CommandMapRef/CommandMapRef.ts'
import * as HandleSocket from '../src/parts/HandleSocket/HandleSocket.ts'

const mockRpc: Rpc = {
  dispose: jest.fn(async () => {}),
  invoke: jest.fn(async () => {}),
  invokeAndTransfer: jest.fn(async () => {}),
  send: jest.fn(),
}
const create = jest.fn(async (_options: unknown) => mockRpc)

test('createSocketRpc', async () => {
  const commandMap = {
    test: jest.fn(),
  }
  const webSocket = {} as WebSocket
  CommandMapRef.set(commandMap)

  await HandleSocket.createSocketRpc(create, webSocket)

  expect(create).toHaveBeenCalledWith({
    commandMap,
    webSocket,
  })
})
