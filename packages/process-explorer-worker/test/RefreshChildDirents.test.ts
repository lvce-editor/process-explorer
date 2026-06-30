import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { Directory, DirectoryExpanded } from '../src/parts/DirentType/DirentType.ts'
import { refreshChildDirents } from '../src/parts/RefreshChildDirents/RefreshChildDirents.ts'

test('refreshChildDirents - basic', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'file1.txt', type: 'file' },
        { name: 'folder1', type: 'directory' },
      ]
    },
  })

  const folder = { depth: 0, name: 'test', path: '/test', selected: false, type: Directory }
  const result = await refreshChildDirents(folder, '/', [])
  expect(result).toHaveLength(2)
  expect(result[0].name).toBe('file1.txt')
  expect(result[0].path).toBe('/test/file1.txt')
  expect(result[0].depth).toBe(1)
  expect(result[1].name).toBe('folder1')
  expect(result[1].path).toBe('/test/folder1')
  expect(result[1].depth).toBe(1)
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/test']])
})

test('refreshChildDirents - with expanded folder', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path?: string) {
      if (path === '/test') {
        return [{ name: 'folder1', type: 'directory' }]
      }
      if (path === '/test/folder1') {
        return [{ name: 'file1.txt', type: 'file' }]
      }
      return []
    },
  })

  const folder = { depth: 0, name: 'test', path: '/test', selected: false, type: Directory }
  const result = await refreshChildDirents(folder, '/', ['/test/folder1'])
  expect(result).toHaveLength(2)
  expect(result[0].name).toBe('folder1')
  expect(result[0].path).toBe('/test/folder1')
  expect(result[0].type).toBe(DirectoryExpanded)
  expect(result[0].depth).toBe(1)
  expect(result[1].name).toBe('file1.txt')
  expect(result[1].path).toBe('/test/folder1/file1.txt')
  expect(result[1].depth).toBe(2)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/test'],
    ['FileSystem.readDirWithFileTypes', '/test/folder1'],
  ])
})
