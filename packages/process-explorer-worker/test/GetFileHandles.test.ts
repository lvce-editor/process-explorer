import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getFileHandles } from '../src/parts/GetFileHandles/GetFileHandles.ts'

class MockFileHandle {
  constructor(public name: string) {}
}

test('getFileHandles', async () => {
  const fileIds = [1, 2, 3]
  const mockFiles = [new MockFileHandle('file1'), new MockFileHandle('file2'), new MockFileHandle('file3')]

  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return mockFiles
    },
  })

  const result = await getFileHandles(fileIds)
  expect(result).toBe(mockFiles)
  expect(result[0]).toBeInstanceOf(MockFileHandle)
  expect(mockRpc.invocations).toEqual([['FileSystemHandle.getFileHandles', fileIds]])
})
