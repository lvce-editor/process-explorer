import { expect, jest, test } from '@jest/globals'

const sendMessagePortToProcessExplorer = jest.fn(
  async (_port: MessagePort) => undefined,
)
const mockRpc = {
  invoke: jest.fn(),
}
const create = jest.fn(
  async ({
    send,
  }: {
    readonly commandMap: Readonly<Record<string, any>>
    readonly send: (port: MessagePort) => Promise<void>
  }) => {
    await send({} as MessagePort)
    return mockRpc
  },
)

jest.unstable_mockModule('@lvce-editor/rpc', () => ({
  LazyTransferMessagePortRpcParent: {
    create,
  },
}))

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  RendererWorker: {
    sendMessagePortToProcessExplorer,
  },
}))

const LaunchProcessExplorerElectron = await import(
  '../src/parts/LaunchProcessExplorerElectron/LaunchProcessExplorerElectron.ts'
)

test('launchProcessExplorerElectron - creates rpc and sends message port', async () => {
  const rpc =
    await LaunchProcessExplorerElectron.launchProcessExplorerElectron()

  expect(rpc).toBe(mockRpc)
  expect(create).toHaveBeenCalledWith({
    commandMap: {},
    send: expect.any(Function),
  })
  expect(sendMessagePortToProcessExplorer).toHaveBeenCalledWith(
    expect.anything(),
  )
})
