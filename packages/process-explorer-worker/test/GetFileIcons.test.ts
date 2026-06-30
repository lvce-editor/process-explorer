import { test, expect } from '@jest/globals'
import { IconThemeWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { FileIconCache } from '../src/parts/FileIconCache/FileIconCache.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as GetFileIcons from '../src/parts/GetFileIcons/GetFileIcons.ts'

test('getFileIcons - empty dirents', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({})

  const result = await GetFileIcons.getFileIcons([], {})
  expect(result).toEqual({
    icons: [],
    newFileIconCache: {},
  })
  expect(mockRpc.invocations).toEqual([])
})

test('getFileIcons - all cached', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({})

  const dirents: readonly ExplorerItem[] = [
    { depth: 0, name: 'a.txt', path: '/a.txt', selected: false, type: DirentType.File },
    { depth: 0, name: 'b', path: '/b', selected: false, type: DirentType.Directory },
  ]
  const cache: FileIconCache = {
    '/a.txt': 'cached-a',
    '/b': 'cached-b',
  }
  const result = await GetFileIcons.getFileIcons(dirents, cache)
  expect(result).toEqual({
    icons: ['cached-a', 'cached-b'],
    newFileIconCache: cache,
  })
  expect(mockRpc.invocations).toEqual([])
})

test('getFileIcons - none cached', async () => {
  const dirents: readonly ExplorerItem[] = [
    { depth: 0, name: 'a.txt', path: '/a.txt', selected: false, type: DirentType.File },
    { depth: 0, name: 'b', path: '/b', selected: false, type: DirentType.Directory },
  ]

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons'() {
      return ['file-icon', 'folder-icon']
    },
  })

  const result = await GetFileIcons.getFileIcons(dirents, {})
  expect(result).toEqual({
    icons: ['file-icon', 'folder-icon'],
    newFileIconCache: {
      '/a.txt': 'file-icon',
      '/b': 'folder-icon',
    },
  })
  expect(mockRpc.invocations).toEqual([
    [
      'IconTheme.getIcons',
      [
        { name: 'a.txt', type: 1 },
        { name: 'b', type: 2 },
      ],
    ],
  ])
})

test('getFileIcons - mixed cache', async () => {
  const dirents: readonly ExplorerItem[] = [
    { depth: 0, name: 'a.txt', path: '/a.txt', selected: false, type: DirentType.File },
    { depth: 0, name: 'b', path: '/b', selected: false, type: DirentType.Directory },
    { depth: 0, name: 'c.txt', path: '/c.txt', selected: false, type: DirentType.File },
  ]
  const cache: FileIconCache = {
    '/a.txt': 'cached-a',
  }

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons'() {
      return ['folder-icon', 'file-icon']
    },
  })

  const result = await GetFileIcons.getFileIcons(dirents, cache)
  expect(result).toEqual({
    icons: ['cached-a', 'folder-icon', 'file-icon'],
    newFileIconCache: {
      '/a.txt': 'cached-a',
      '/b': 'folder-icon',
      '/c.txt': 'file-icon',
    },
  })
  expect(mockRpc.invocations).toEqual([
    [
      'IconTheme.getIcons',
      [
        { name: 'b', type: 2 },
        { name: 'c.txt', type: 1 },
      ],
    ],
  ])
})
