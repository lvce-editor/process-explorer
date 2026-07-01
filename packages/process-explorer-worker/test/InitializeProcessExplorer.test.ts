import { beforeEach, expect, jest, test } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'

const electronRpc = {
  invoke: jest.fn(),
}
const nodeRpc = {
  invoke: jest.fn(),
}
const launchProcessExplorerElectron = jest.fn(async () => electronRpc)
const launchProcessExplorerNode = jest.fn(async () => nodeRpc)
const set = jest.fn()

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
    set,
  }),
)

const InitializeProcessExplorer = await import(
  '../src/parts/InitializeProcessExplorer/InitializeProcessExplorer.ts'
)

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

test('initializeProcessExplorer - remote', async () => {
  await InitializeProcessExplorer.initializeProcessExplorer(PlatformType.Remote)

  expect(launchProcessExplorerNode).toHaveBeenCalledTimes(1)
  expect(launchProcessExplorerElectron).not.toHaveBeenCalled()
  expect(set).toHaveBeenCalledWith(nodeRpc)
})

test('initializeProcessExplorer - other platform', async () => {
  await InitializeProcessExplorer.initializeProcessExplorer(0)

  expect(launchProcessExplorerElectron).not.toHaveBeenCalled()
  expect(launchProcessExplorerNode).not.toHaveBeenCalled()
  expect(set).not.toHaveBeenCalled()
})
