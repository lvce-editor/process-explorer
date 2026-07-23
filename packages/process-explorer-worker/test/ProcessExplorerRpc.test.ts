import type { Rpc } from '@lvce-editor/rpc'
import { expect, jest, test } from '@jest/globals'
import * as ProcessExplorer from '../src/parts/ProcessExplorer/ProcessExplorer.ts'

const createRpc = (): Rpc => ({
  dispose: jest.fn(async () => {}),
  invoke: jest.fn(async () => {}),
  invokeAndTransfer: jest.fn(async () => {}),
  send: jest.fn(),
})

test('dispose', async () => {
  const rpc = createRpc()
  ProcessExplorer.set(rpc)

  await ProcessExplorer.dispose()

  expect(rpc.dispose).toHaveBeenCalledTimes(1)
  await expect(ProcessExplorer.invoke('test')).rejects.toThrow(
    'ProcessExplorerModule is not initialized',
  )
})
