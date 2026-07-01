import { expect, jest, test } from '@jest/globals'

const mockRpc = {
  invoke: jest.fn(),
}
const create = jest.fn(async () => mockRpc)

jest.unstable_mockModule('@lvce-editor/rpc', () => ({
  LazyWebSocketRpcParent2: {
    create,
  },
}))

const LaunchProcessExplorerNode = await import(
  '../src/parts/LaunchProcessExplorerNode/LaunchProcessExplorerNode.ts'
)

test('launchProcessExplorerNode - creates websocket rpc', async () => {
  const rpc = await LaunchProcessExplorerNode.launchProcessExplorerNode()

  expect(rpc).toBe(mockRpc)
  expect(create).toHaveBeenCalledWith({
    commandMap: {},
    type: 'process-explorer',
  })
})
