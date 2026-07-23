import { expect, jest, test } from '@jest/globals'

const mockRpc = {
  invoke: jest.fn(),
}
const create = jest.fn(
  async (_options: {
    readonly commandMap: Readonly<Record<string, any>>
    readonly onClose?: () => void
    readonly type: string
  }) => mockRpc,
)

jest.unstable_mockModule('@lvce-editor/rpc', () => ({
  LazyWebSocketRpcParent2: {
    create,
  },
}))

const LaunchProcessExplorerNode =
  await import('../src/parts/LaunchProcessExplorerNode/LaunchProcessExplorerNode.ts')

test('launchProcessExplorerNode - creates websocket rpc', async () => {
  const onClose = jest.fn()
  const rpc = await LaunchProcessExplorerNode.launchProcessExplorerNode(onClose)

  expect(rpc).toBe(mockRpc)
  expect(create).toHaveBeenCalledWith({
    commandMap: {},
    onClose,
    type: 'process-explorer',
  })
})
