import { expect, test } from '@jest/globals'
import { RendererWorker as RpcRendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleUpload } from '../src/parts/HandleUpload/HandleUpload.ts'

test('should upload a file', async () => {
  using mockRpc = RpcRendererWorker.registerMockRpc({
    'FileSystem.writeFile'(...args: any[]) {
      // Mock implementation
    },
  })
  const state = createDefaultState()
  const file = { name: 'test.txt', text: (): string => 'hello' }
  const dirents = [{ file, type: 1 }]
  await handleUpload(state, dirents)
  expect(mockRpc.invocations).toEqual([['FileSystem.writeFile', expect.stringContaining('test.txt'), 'hello']])
})

test('should do nothing for empty dirents', async () => {
  using mockRpc = RpcRendererWorker.registerMockRpc({})
  const state = createDefaultState()
  await handleUpload(state, [])
  expect(mockRpc.invocations).toEqual([])
})
