import { expect, jest, test } from '@jest/globals'

const mockRpc = {
  invoke: jest.fn(),
}
const create = jest.fn(async (_options: unknown) => mockRpc)
const createLazy = jest.fn(async (_options: unknown) => mockRpc)
const invoke = jest.fn(async (_method: string, _type: string) => ({
  protocols: ['lvce-rpc', 'lvce-capability.token'],
  url: 'ws://localhost/websocket/capability',
}))

jest.unstable_mockModule('@lvce-editor/rpc', () => ({
  LazyWebSocketRpcParent2: {
    create: createLazy,
  },
  WebSocketRpcParent: {
    create,
  },
}))

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  RendererWorker: {
    invoke,
  },
}))

const LaunchProcessExplorerNode =
  await import('../src/parts/LaunchProcessExplorerNode/LaunchProcessExplorerNode.ts')

test('launchProcessExplorerNode - creates a capability websocket rpc', async () => {
  const onClose = jest.fn()
  const addEventListener = jest.fn()
  const webSocket = { addEventListener }
  const MockWebSocket = jest.fn(
    (_url: string, _protocols: readonly string[]) => webSocket,
  )
  Object.defineProperty(globalThis, 'WebSocket', {
    configurable: true,
    value: MockWebSocket,
  })

  const rpc = await LaunchProcessExplorerNode.launchProcessExplorerNode(onClose)

  expect(rpc).toBe(mockRpc)
  expect(invoke).toHaveBeenCalledWith(
    'WebSocketCapability.create',
    'process-explorer',
  )
  expect(MockWebSocket).toHaveBeenCalledWith(
    'ws://localhost/websocket/capability',
    ['lvce-rpc', 'lvce-capability.token'],
  )
  expect(addEventListener).toHaveBeenCalledWith('close', onClose)
  expect(create).toHaveBeenCalledWith({
    commandMap: {},
    webSocket,
  })
})

test('launchProcessExplorerNode - falls back when an older renderer has no capability module', async () => {
  invoke.mockRejectedValueOnce(
    new Error('module WebSocketCapability not found'),
  )

  const rpc = await LaunchProcessExplorerNode.launchProcessExplorerNode(
    jest.fn(),
  )

  expect(rpc).toBe(mockRpc)
  expect(createLazy).toHaveBeenCalledWith({
    commandMap: {},
    onClose: expect.any(Function),
    type: 'process-explorer',
  })
})
