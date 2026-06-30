import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as SendMessagePortToErrorWorker from '../src/parts/SendMessagePortToErrorWorker/SendMessagePortToErrorWorker.ts'

test('sendMessagePortToErrorWorker', async () => {
  const sendMessagePortToErrorWorker = jest.fn()
  const port = {} as MessagePort
  using _mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToErrorWorker':
      sendMessagePortToErrorWorker,
  })
  await SendMessagePortToErrorWorker.sendMessagePortToErrorWorker(port)
  expect(sendMessagePortToErrorWorker).toHaveBeenCalledWith(
    port,
    'Errors.handleMessagePort',
    0,
  )
})
