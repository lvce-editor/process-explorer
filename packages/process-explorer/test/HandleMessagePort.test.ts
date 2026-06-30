import type { Rpc } from '@lvce-editor/rpc'
import { expect, jest, test } from '@jest/globals'
import * as CommandMapRef from '../src/parts/CommandMapRef/CommandMapRef.ts'
import * as HandleMessagePort from '../src/parts/HandleMessagePort/HandleMessagePort.ts'

const mockRpc: Rpc = {
  dispose: jest.fn(async () => {}),
  invoke: jest.fn(async () => {}),
  invokeAndTransfer: jest.fn(async () => {}),
  send: jest.fn(),
}
const create = jest.fn(async (_options: unknown) => mockRpc)

test('createMessagePortRpc', async () => {
  const commandMap = {
    test: jest.fn(),
  }
  const messagePort = {}
  CommandMapRef.set(commandMap)

  await HandleMessagePort.createMessagePortRpc(create, messagePort)

  expect(create).toHaveBeenCalledWith({
    commandMap,
    messagePort,
    requiresSocket: expect.any(Function),
  })
})
