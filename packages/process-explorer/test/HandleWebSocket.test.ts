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

test('createWebSocketRpc', async () => {
  const create = jest.fn(async (_options: unknown) => mockRpc)
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

test('handleWebSocket - socket closed during transfer', async () => {
  await expect(HandleWebSocket.handleWebSocket(undefined, {})).resolves.toBe(
    undefined,
  )
  await expect(HandleWebSocket.handleWebSocket({}, undefined)).resolves.toBe(
    undefined,
  )
})
