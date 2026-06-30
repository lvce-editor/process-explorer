import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { DirectoryExpanded, File } from '../src/parts/DirentType/DirentType.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { refresh } from '../src/parts/Refresh/Refresh.ts'

test('refresh - empty state', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return []
    },
  })

  const state: ExplorerState = createDefaultState()
  const result = await refresh(state)
  expect(result.items).toHaveLength(0)
  expect(result.icons).toHaveLength(0)
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/']])
})

test('refresh - with top level items', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'file1', type: DirentType.File },
        { name: 'file2', type: DirentType.File },
      ]
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return []
    },
  })

  const state: ExplorerState = createDefaultState()
  const result = await refresh(state)
  expect(result.items).toHaveLength(2)
  expect(result.items[0].name).toBe('file1')
  expect(result.items[1].name).toBe('file2')
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/']])
})

test('refresh - preserve expanded folder', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(_path: string) {
      if (_path === '/') {
        return [{ name: 'folder1', type: DirentType.Directory }]
      }
      if (_path === '/folder1') {
        return [
          { name: 'file1.txt', type: 'file' },
          { name: 'file2.txt', type: 'file' },
        ]
      }
      return []
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'folder1', path: '/folder1', selected: false, type: DirectoryExpanded },
      { depth: 1, name: 'file1.txt', path: '/folder1/file1.txt', selected: false, type: File },
      { depth: 1, name: 'file2.txt', path: '/folder1/file2.txt', selected: false, type: File },
    ],
  }

  const result = await refresh(state)
  expect(result.items).toHaveLength(3)
  expect(result.items[0].name).toBe('folder1')
  expect(result.items[0].type).toBe(DirectoryExpanded)
  expect(result.items[1].name).toBe('file1.txt')
  expect(result.items[2].name).toBe('file2.txt')
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/'],
    ['FileSystem.readDirWithFileTypes', '/folder1'],
  ])
})

test('refresh - remove expanded folder that no longer exists', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [{ name: 'file1.txt', type: DirentType.File }]
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'folder1', path: '/folder1', selected: false, type: DirectoryExpanded },
      { depth: 1, name: 'file1.txt', path: '/folder1/file1.txt', selected: false, type: File },
    ],
  }

  const result = await refresh(state)
  expect(result.items).toHaveLength(1)
  expect(result.items[0].name).toBe('file1.txt')
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/'],
    ['FileSystem.readDirWithFileTypes', '/folder1'],
  ])
})

test('refresh - nested expanded folders', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/') {
        return [{ name: 'folder1', type: DirentType.Directory }]
      }
      if (path === '/folder1') {
        return [{ name: 'folder2', type: DirentType.Directory }]
      }
      if (path === '/folder1/folder2') {
        return [{ name: 'file1.txt', type: DirentType.File }]
      }
      return []
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'folder1', path: '/folder1', selected: false, type: DirectoryExpanded },
      { depth: 1, name: 'folder2', path: '/folder1/folder2', selected: false, type: DirectoryExpanded },
      { depth: 2, name: 'file1.txt', path: '/folder1/folder2/file1.txt', selected: false, type: File },
    ],
  }

  const result = await refresh(state)
  expect(result.items).toHaveLength(3)
  expect(result.items[0].name).toBe('folder1')
  expect(result.items[0].type).toBe(DirectoryExpanded)
  expect(result.items[1].name).toBe('folder2')
  expect(result.items[1].type).toBe(DirectoryExpanded)
  expect(result.items[2].name).toBe('file1.txt')
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/'],
    ['FileSystem.readDirWithFileTypes', '/folder1'],
    ['FileSystem.readDirWithFileTypes', '/folder1/folder2'],
  ])
})

test('refresh - preserve directory types', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/') {
        return [
          { name: 'folder1', type: DirentType.Directory },
          { name: 'file1.txt', type: DirentType.File },
        ]
      }
      if (path === '/folder1') {
        return [
          { name: 'subfolder', type: DirentType.Directory },
          { name: 'file2.txt', type: DirentType.File },
        ]
      }
      if (path === '/folder1/subfolder') {
        return [{ name: 'file3.txt', type: DirentType.File }]
      }
      return []
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'folder1', path: '/folder1', selected: false, type: DirectoryExpanded },
      { depth: 1, name: 'subfolder', path: '/folder1/subfolder', selected: false, type: DirectoryExpanded },
      { depth: 2, name: 'file3.txt', path: '/folder1/subfolder/file3.txt', selected: false, type: File },
      { depth: 1, name: 'file2.txt', path: '/folder1/file2.txt', selected: false, type: File },
      { depth: 0, name: 'file1.txt', path: '/file1.txt', selected: false, type: File },
    ],
  }

  const result = await refresh(state)
  expect(result.items).toHaveLength(5)
  expect(result.items[0].name).toBe('folder1')
  expect(result.items[0].type).toBe(DirectoryExpanded)
  expect(result.items[1].name).toBe('subfolder')
  expect(result.items[1].type).toBe(DirectoryExpanded)
  expect(result.items[2].name).toBe('file3.txt')
  expect(result.items[2].type).toBe(File)
  expect(result.items[3].name).toBe('file2.txt')
  expect(result.items[3].type).toBe(File)
  expect(result.items[4].name).toBe('file1.txt')
  expect(result.items[4].type).toBe(File)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/'],
    ['FileSystem.readDirWithFileTypes', '/folder1'],
    ['FileSystem.readDirWithFileTypes', '/folder1/subfolder'],
  ])
})

test('refresh - check filesystem response', async () => {
  const methodCalls: string[] = []
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      methodCalls.push('FileSystem.readDirWithFileTypes')
      if (path === '/') {
        return [
          { name: 'folder1', type: DirentType.Directory },
          { name: 'file1.txt', type: DirentType.File },
        ]
      }
      return []
    },
    'IconTheme.getFileIcon'() {
      methodCalls.push('IconTheme.getFileIcon')
      return ''
    },
    'IconTheme.getFolderIcon'() {
      methodCalls.push('IconTheme.getFolderIcon')
      return ''
    },
    'IconTheme.getIcons'() {
      methodCalls.push('IconTheme.getIcons')
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'folder1', path: '/folder1', selected: false, type: DirectoryExpanded },
      { depth: 0, name: 'file1.txt', path: '/file1.txt', selected: false, type: File },
    ],
  }

  const result = await refresh(state)
  expect(methodCalls).toContain('FileSystem.readDirWithFileTypes')
  expect(result.items[0].type).toBe(DirectoryExpanded)
  expect(result.items[1].type).toBe(File)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/'],
    ['FileSystem.readDirWithFileTypes', '/folder1'],
  ])
})
