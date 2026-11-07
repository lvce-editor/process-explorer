import { beforeEach, expect, jest, test } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'

const mainProcessRpc = {
  invoke: jest.fn(),
}
const processExplorerRpc = {
  invoke: jest.fn(),
}
const nodeRpc = {
  invoke: jest.fn(),
}
const launchProcessExplorerElectron = jest.fn(async () => ({
  mainProcessRpc,
  processExplorerRpc,
}))
const launchProcessExplorerNode = jest.fn(
  async (_onClose: () => void) => nodeRpc,
)
const handleProcessExplorerRpcClose = jest.fn(async () => {})
const disposeMainProcess = jest.fn(async () => {})
const disposeProcessExplorer = jest.fn(async () => {})
const disposeRemoteProcessExplorer = jest.fn(async () => {})
const setMainProcess = jest.fn()
const clear = jest.fn()
const clearRemoteProcessExplorer = jest.fn()
const hasRemoteProcessExplorer = jest.fn(() => false)
const setRemoteProcessExplorer = jest.fn()
const setProcessExplorer = jest.fn()
const rendererInvoke = jest.fn<(method: string) => Promise<boolean>>(
  async (_method: string) => false,
)

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  MainProcess: {
    dispose: disposeMainProcess,
    set: setMainProcess,
  },
  RendererWorker: {
    invoke: rendererInvoke,
  },
}))

jest.unstable_mockModule(
  '../src/parts/HandleProcessExplorerRpcClose/HandleProcessExplorerRpcClose.ts',
  () => ({
    handleProcessExplorerRpcClose,
  }),
)

jest.unstable_mockModule(
  '../src/parts/LaunchProcessExplorerElectron/LaunchProcessExplorerElectron.ts',
  () => ({
    launchProcessExplorerElectron,
  }),
)

jest.unstable_mockModule(
  '../src/parts/LaunchProcessExplorerNode/LaunchProcessExplorerNode.ts',
  () => ({
    launchProcessExplorerNode,
  }),
)

jest.unstable_mockModule(
  '../src/parts/ProcessExplorer/ProcessExplorer.ts',
  () => ({
    clear,
    dispose: disposeProcessExplorer,
    set: setProcessExplorer,
  }),
)

jest.unstable_mockModule(
  '../src/parts/RemoteProcessExplorer/RemoteProcessExplorer.ts',
  () => ({
    clear: clearRemoteProcessExplorer,
    dispose: disposeRemoteProcessExplorer,
    has: hasRemoteProcessExplorer,
    set: setRemoteProcessExplorer,
  }),
)

const InitializeProcessExplorer =
  await import('../src/parts/InitializeProcessExplorer/InitializeProcessExplorer.ts')

beforeEach(() => {
  InitializeProcessExplorer.clear()
  jest.clearAllMocks()
})

test('initializeProcessExplorer - electron', async () => {
  await InitializeProcessExplorer.initializeProcessExplorer(
    PlatformType.Electron,
  )

  expect(launchProcessExplorerElectron).toHaveBeenCalledTimes(1)
  expect(launchProcessExplorerNode).not.toHaveBeenCalled()
  expect(setMainProcess).toHaveBeenCalledWith(mainProcessRpc)
  expect(setProcessExplorer).toHaveBeenCalledWith(processExplorerRpc)
})

test('initializeProcessExplorer - already initialized', async () => {
  await InitializeProcessExplorer.initializeProcessExplorer(
    PlatformType.Electron,
  )
  await InitializeProcessExplorer.initializeProcessExplorer(
    PlatformType.Electron,
  )

  expect(launchProcessExplorerElectron).toHaveBeenCalledTimes(1)
  expect(launchProcessExplorerNode).not.toHaveBeenCalled()
  expect(setMainProcess).toHaveBeenCalledTimes(1)
  expect(setProcessExplorer).toHaveBeenCalledTimes(1)
})

test('initializeProcessExplorer - remote', async () => {
  await InitializeProcessExplorer.initializeProcessExplorer(PlatformType.Remote)

  expect(launchProcessExplorerNode).toHaveBeenCalledTimes(1)
  expect(launchProcessExplorerNode).toHaveBeenCalledWith(expect.any(Function))
  expect(launchProcessExplorerElectron).not.toHaveBeenCalled()
  expect(setMainProcess).not.toHaveBeenCalled()
  expect(setProcessExplorer).toHaveBeenCalledWith(nodeRpc)
})

test('initializeProcessExplorer - electron with remote workspace', async () => {
  rendererInvoke.mockResolvedValueOnce(true)

  await InitializeProcessExplorer.initializeProcessExplorer(
    PlatformType.Electron,
  )

  expect(launchProcessExplorerElectron).toHaveBeenCalledTimes(1)
  expect(launchProcessExplorerNode).toHaveBeenCalledTimes(1)
  expect(setProcessExplorer).toHaveBeenCalledWith(processExplorerRpc)
  expect(setRemoteProcessExplorer).toHaveBeenCalledWith(nodeRpc)
})

test('initializeProcessExplorer - disposes remote rpc after workspace disconnects', async () => {
  rendererInvoke.mockResolvedValueOnce(true).mockResolvedValueOnce(false)
  await InitializeProcessExplorer.initializeProcessExplorer(
    PlatformType.Electron,
  )

  await InitializeProcessExplorer.initializeProcessExplorer(
    PlatformType.Electron,
  )

  expect(disposeRemoteProcessExplorer).toHaveBeenCalledTimes(1)
})

test('initializeProcessExplorer - remote connection closes', async () => {
  await InitializeProcessExplorer.initializeProcessExplorer(PlatformType.Remote)
  const onClose = launchProcessExplorerNode.mock.calls[0][0]

  onClose()
  await Promise.resolve()
  await InitializeProcessExplorer.initializeProcessExplorer(PlatformType.Remote)

  expect(clear).toHaveBeenCalledTimes(1)
  expect(handleProcessExplorerRpcClose).toHaveBeenCalledTimes(1)
  expect(launchProcessExplorerNode).toHaveBeenCalledTimes(2)
})

test('initializeProcessExplorer - other platform', async () => {
  await InitializeProcessExplorer.initializeProcessExplorer(0)

  expect(launchProcessExplorerElectron).not.toHaveBeenCalled()
  expect(launchProcessExplorerNode).not.toHaveBeenCalled()
  expect(setMainProcess).not.toHaveBeenCalled()
  expect(setProcessExplorer).not.toHaveBeenCalled()
})

test('dispose - electron rpcs', async () => {
  await InitializeProcessExplorer.initializeProcessExplorer(
    PlatformType.Electron,
  )

  await InitializeProcessExplorer.dispose()

  expect(disposeMainProcess).toHaveBeenCalledTimes(1)
  expect(disposeProcessExplorer).toHaveBeenCalledTimes(1)
  expect(disposeRemoteProcessExplorer).toHaveBeenCalledTimes(1)
})

test('dispose - remote rpc', async () => {
  await InitializeProcessExplorer.initializeProcessExplorer(PlatformType.Remote)

  await InitializeProcessExplorer.dispose()

  expect(disposeMainProcess).not.toHaveBeenCalled()
  expect(disposeProcessExplorer).toHaveBeenCalledTimes(1)
})

test('reconnecting SSH keeps healthy Electron endpoints and reuses the new remote connection', async () => {
  rendererInvoke.mockResolvedValue(true)
  await InitializeProcessExplorer.initializeProcessExplorer(
    PlatformType.Electron,
  )
  const onClose = launchProcessExplorerNode.mock.calls[0][0]
  onClose()
  await InitializeProcessExplorer.initializeProcessExplorer(
    PlatformType.Electron,
  )
  await InitializeProcessExplorer.initializeProcessExplorer(
    PlatformType.Electron,
  )
  expect(launchProcessExplorerElectron).toHaveBeenCalledTimes(1)
  expect(launchProcessExplorerNode).toHaveBeenCalledTimes(2)
  expect(clearRemoteProcessExplorer).toHaveBeenCalledTimes(1)
  expect(clear).not.toHaveBeenCalled()
  await InitializeProcessExplorer.dispose()
  expect(disposeRemoteProcessExplorer).toHaveBeenCalledTimes(1)
  rendererInvoke.mockResolvedValue(false)
})

test('retry retires an endpoint before its close event and ignores that stale close after reconnecting', async () => {
  await InitializeProcessExplorer.initializeProcessExplorer(PlatformType.Remote)
  const oldClose = launchProcessExplorerNode.mock.calls[0][0]
  await InitializeProcessExplorer.retireClosedConnection()
  await InitializeProcessExplorer.initializeProcessExplorer(PlatformType.Remote)
  oldClose()
  await InitializeProcessExplorer.initializeProcessExplorer(PlatformType.Remote)
  expect(disposeProcessExplorer).toHaveBeenCalledTimes(1)
  expect(launchProcessExplorerNode).toHaveBeenCalledTimes(2)
  expect(handleProcessExplorerRpcClose).not.toHaveBeenCalled()
})

test('retiring a closed Electron endpoint preserves the optional SSH endpoint', async () => {
  rendererInvoke.mockResolvedValue(true)
  await InitializeProcessExplorer.initializeProcessExplorer(
    PlatformType.Electron,
  )
  await InitializeProcessExplorer.retireClosedConnection()
  await InitializeProcessExplorer.initializeProcessExplorer(
    PlatformType.Electron,
  )
  expect(disposeMainProcess).toHaveBeenCalledTimes(1)
  expect(disposeProcessExplorer).toHaveBeenCalledTimes(1)
  expect(disposeRemoteProcessExplorer).not.toHaveBeenCalled()
  expect(launchProcessExplorerElectron).toHaveBeenCalledTimes(2)
  expect(launchProcessExplorerNode).toHaveBeenCalledTimes(1)
  rendererInvoke.mockResolvedValue(false)
})
