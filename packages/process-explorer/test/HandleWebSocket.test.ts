import type { Rpc } from '@lvce-editor/rpc'
import { beforeEach, expect, jest, test } from '@jest/globals'

const mockRpc: Rpc = {
  dispose: jest.fn(async () => {}),
  invoke: jest.fn(async () => {}),
  invokeAndTransfer: jest.fn(async () => {}),
  send: jest.fn(),
}

const createNodeWebSocketRpc = jest.fn(async (_options: unknown) => mockRpc)
const setRpc = jest.fn()
const setMainProcessRpc = jest.fn()

jest.unstable_mockModule('@lvce-editor/rpc', () => ({
  NodeWebSocketRpcClient: {
    create: createNodeWebSocketRpc,
  },
}))

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  MainProcess: {
    set: setMainProcessRpc,
  },
  RpcId: {
    MainProcess: 1,
  },
  set: setRpc,
}))

const CommandMapRef = await import(
  '../src/parts/CommandMapRef/CommandMapRef.ts'
)
const HandleWebSocket = await import(
  '../src/parts/HandleWebSocket/HandleWebSocket.ts'
)
const RequiresSocket = await import(
  '../src/parts/RequiresSocket/RequiresSocket.ts'
)

beforeEach(() => {
  jest.clearAllMocks()
})

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
  await HandleWebSocket.handleWebSocket(undefined, {})
  await HandleWebSocket.handleWebSocket({}, undefined)

  expect(createNodeWebSocketRpc).not.toHaveBeenCalled()
  expect(setRpc).not.toHaveBeenCalled()
})

test('handleWebSocket', async () => {
  const commandMap = {
    test: jest.fn(),
  }
  const handle = {}
  const request = {}
  const rpcId = 42
  CommandMapRef.set(commandMap)

  await HandleWebSocket.handleWebSocket(handle, request, rpcId)

  expect(createNodeWebSocketRpc).toHaveBeenCalledWith({
    commandMap,
    handle,
    request,
    requiresSocket: RequiresSocket.requiresSocket,
  })
  expect(setRpc).toHaveBeenCalledWith(rpcId, mockRpc)
})
