import { beforeEach, expect, jest, test } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'

const electronRpc = {
  invoke: jest.fn(),
}
const nodeRpc = {
  invoke: jest.fn(),
}
const launchProcessExplorerElectron = jest.fn(async () => electronRpc)
const launchProcessExplorerNode = jest.fn(
  async (_onClose: () => void) => nodeRpc,
)
const handleProcessExplorerRpcClose = jest.fn(async () => {})
const clear = jest.fn()
const set = jest.fn()

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
    set,
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
  expect(set).toHaveBeenCalledWith(electronRpc)
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
  expect(set).toHaveBeenCalledTimes(1)
})

test('initializeProcessExplorer - remote', async () => {
  await InitializeProcessExplorer.initializeProcessExplorer(PlatformType.Remote)

  expect(launchProcessExplorerNode).toHaveBeenCalledTimes(1)
  expect(launchProcessExplorerNode).toHaveBeenCalledWith(expect.any(Function))
  expect(launchProcessExplorerElectron).not.toHaveBeenCalled()
  expect(set).toHaveBeenCalledWith(nodeRpc)
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
  expect(set).not.toHaveBeenCalled()
})
