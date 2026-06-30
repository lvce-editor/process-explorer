import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { FileOperation } from '../src/parts/FileOperation/FileOperation.ts'
import { applyFileOperations } from '../src/parts/ApplyFileOperations/ApplyFileOperations.ts'
import * as FileOperationType from '../src/parts/FileOperationType/FileOperationType.ts'

test('should apply empty operations', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {},
    'FileSystem.writeFile'() {},
  })
  const operations: readonly FileOperation[] = []
  await applyFileOperations(operations)
  expect(mockRpc.invocations).toEqual([])
})

test('should create folder', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {},
    'FileSystem.writeFile'() {},
  })
  const operations: readonly FileOperation[] = [{ path: '/test/folder', type: FileOperationType.CreateFolder }]
  await applyFileOperations(operations)
  expect(mockRpc.invocations).toEqual([['FileSystem.mkdir', '/test/folder']])
})

test('should create file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {},
    'FileSystem.writeFile'() {},
  })
  const operations: readonly FileOperation[] = [{ path: '/test/file.txt', text: 'content', type: FileOperationType.CreateFile }]
  await applyFileOperations(operations)
  expect(mockRpc.invocations).toEqual([['FileSystem.writeFile', '/test/file.txt', 'content']])
})

test('should apply multiple operations in sequence', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {},
    'FileSystem.writeFile'() {},
  })
  const operations: readonly FileOperation[] = [
    { path: '/test/folder', type: FileOperationType.CreateFolder },
    { path: '/test/folder/file.txt', text: 'content', type: FileOperationType.CreateFile },
  ]
  await applyFileOperations(operations)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.mkdir', '/test/folder'],
    ['FileSystem.writeFile', '/test/folder/file.txt', 'content'],
  ])
})
