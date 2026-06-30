import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as FileSystem from '../src/parts/FileSystem/FileSystem.ts'

test('readDirWithFileTypes', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'file.txt', type: 1 },
        { name: 'folder', type: 2 },
      ]
    },
  })

  const result = await FileSystem.readDirWithFileTypes('/test')
  expect(result).toEqual([
    { name: 'file.txt', type: 1 },
    { name: 'folder', type: 2 },
  ])
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/test']])
})

test('writeFile', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.writeFile'() {
      return undefined
    },
  })

  await expect(FileSystem.writeFile('/test/file.txt', 'content')).resolves.toBeUndefined()
  expect(mockRpc.invocations).toEqual([['FileSystem.writeFile', '/test/file.txt', 'content']])
})

test('remove', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.remove'() {
      return undefined
    },
  })

  await expect(FileSystem.remove('/test/file.txt')).resolves.toBeUndefined()
  expect(mockRpc.invocations).toEqual([['FileSystem.remove', '/test/file.txt']])
})

test('mkdir', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {
      return undefined
    },
  })

  await expect(FileSystem.mkdir('/test/newfolder')).resolves.toBeUndefined()
  expect(mockRpc.invocations).toEqual([['FileSystem.mkdir', '/test/newfolder']])
})

test('rename', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.rename'() {
      return undefined
    },
  })

  await expect(FileSystem.rename('/test/old.txt', '/test/new.txt')).resolves.toBeUndefined()
  expect(mockRpc.invocations).toEqual([['FileSystem.rename', '/test/old.txt', '/test/new.txt']])
})

test('copy', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.copy'() {
      return undefined
    },
  })

  await expect(FileSystem.copy('/test/source.txt', '/test/dest.txt')).resolves.toBeUndefined()
  expect(mockRpc.invocations).toEqual([['FileSystem.copy', '/test/source.txt', '/test/dest.txt']])
})

test('getRealPath', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getRealPath'() {
      return '/real/path'
    },
  })

  const path = await FileSystem.getRealPath('/test/link')
  expect(path).toBe('/real/path')
  expect(mockRpc.invocations).toEqual([['FileSystem.getRealPath', '/test/link']])
})

test('getPathSeparator', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
  })

  const result = await FileSystem.getPathSeparator('/')
  expect(result).toBe('/')
  expect(mockRpc.invocations).toEqual([['FileSystem.getPathSeparator', '/']])
})
