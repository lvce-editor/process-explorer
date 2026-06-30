import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as SendMessagePortToFileSystemWorker from '../src/parts/SendMessagePortToFileSystemWorker/SendMessagePortToFileSystemWorker.ts'

test('sendMessagePortToFileSystemWorker forwards port to renderer worker', async () => {
  const sendMessagePortToFileSystemWorker = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker':
      sendMessagePortToFileSystemWorker,
  })
  const port = {}
  await SendMessagePortToFileSystemWorker.sendMessagePortToFileSystemWorker(
    port,
  )
  expect(sendMessagePortToFileSystemWorker).toHaveBeenCalledWith(
    port,
    'FileSystem.handleMessagePort',
    0,
  )
})
