import type { Rpc } from '@lvce-editor/rpc'
import { expect, jest, test } from '@jest/globals'
import * as RemoteProcessExplorer from '../src/parts/RemoteProcessExplorer/RemoteProcessExplorer.ts'

const createRpc = (): Rpc => ({
  dispose: jest.fn(async () => {}),
  invoke: jest.fn(async () => 'result'),
  invokeAndTransfer: jest.fn(async () => {}),
  send: jest.fn(),
})

test('set, invoke and dispose', async () => {
  const rpc = createRpc()
  RemoteProcessExplorer.set(rpc)

  expect(RemoteProcessExplorer.has()).toBe(true)
  await expect(RemoteProcessExplorer.invoke('test', 1)).resolves.toBe('result')
  expect(rpc.invoke).toHaveBeenCalledWith('test', 1)

  await RemoteProcessExplorer.dispose()

  expect(rpc.dispose).toHaveBeenCalledTimes(1)
  expect(RemoteProcessExplorer.has()).toBe(false)
  await expect(RemoteProcessExplorer.invoke('test')).rejects.toThrow(
    'RemoteProcessExplorerModule is not initialized',
  )
})
