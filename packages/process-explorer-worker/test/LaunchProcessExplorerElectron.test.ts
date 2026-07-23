import { expect, jest, test } from '@jest/globals'

const invokeAndTransfer = jest.fn(
  async (..._args: readonly unknown[]) => undefined,
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
    invokeAndTransfer,
  },
}))

const LaunchProcessExplorerElectron =
  await import('../src/parts/LaunchProcessExplorerElectron/LaunchProcessExplorerElectron.ts')

test('launchProcessExplorerElectron - creates rpc and sends message port', async () => {
  const rpc =
    await LaunchProcessExplorerElectron.launchProcessExplorerElectron()

  expect(rpc).toBe(mockRpc)
  expect(create).toHaveBeenCalledWith({
    commandMap: {},
    send: expect.any(Function),
  })
  expect(invokeAndTransfer).toHaveBeenCalledWith(
    'SendMessagePortToMainProcess.sendMessagePortToMainProcess',
    expect.anything(),
    'HandleElectronMessagePort.handleElectronMessagePort',
    33,
  )
})
