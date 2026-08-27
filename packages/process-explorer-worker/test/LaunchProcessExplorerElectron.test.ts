import { beforeEach, expect, jest, test } from '@jest/globals'

const invokeAndTransfer = jest.fn(
  async (..._args: readonly unknown[]) => undefined,
)
const sendMessagePortToProcessExplorer = jest.fn(
  async (_port: MessagePort) => undefined,
)
const processExplorerRpc = {
  dispose: jest.fn(async () => {}),
  invoke: jest.fn(),
}
const mainProcessRpc = {
  dispose: jest.fn(async () => {}),
  invoke: jest.fn(),
}
const rpcs = [processExplorerRpc, mainProcessRpc]
const create = jest.fn(
  async ({
    send,
  }: {
    readonly commandMap: Readonly<Record<string, any>>
    readonly send: (port: MessagePort) => Promise<void>
  }) => {
    await send({} as MessagePort)
    return rpcs[create.mock.calls.length - 1]
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
    sendMessagePortToProcessExplorer,
  },
}))

const LaunchProcessExplorerElectron =
  await import('../src/parts/LaunchProcessExplorerElectron/LaunchProcessExplorerElectron.ts')

beforeEach(() => {
  jest.clearAllMocks()
})

test('launchProcessExplorerElectron - creates rpc and sends message port', async () => {
  const rpcs =
    await LaunchProcessExplorerElectron.launchProcessExplorerElectron()

  expect(rpcs).toEqual({
    mainProcessRpc,
    processExplorerRpc,
  })
  expect(create).toHaveBeenCalledTimes(2)
  expect(sendMessagePortToProcessExplorer).toHaveBeenCalledWith(
    expect.anything(),
  )
  expect(invokeAndTransfer).toHaveBeenCalledWith(
    'SendMessagePortToMainProcess.sendMessagePortToMainProcess',
    expect.anything(),
    'HandleElectronMessagePort.handleElectronMessagePort',
    33,
  )
})

test('launchProcessExplorerElectron - disposes process explorer rpc when main process rpc creation fails', async () => {
  create
    .mockImplementationOnce(async ({ send }) => {
      await send({} as MessagePort)
      return processExplorerRpc
    })
    .mockRejectedValueOnce(new Error('Failed to connect to main process'))

  await expect(
    LaunchProcessExplorerElectron.launchProcessExplorerElectron(),
  ).rejects.toThrow(
    'Failed to create process explorer electron rpcs: Failed to connect to main process',
  )

  expect(processExplorerRpc.dispose).toHaveBeenCalledTimes(1)
})
