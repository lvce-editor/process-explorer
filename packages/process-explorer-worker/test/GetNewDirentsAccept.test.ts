import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getNewDirentsAccept } from '../src/parts/GetNewDirentsAccept/GetNewDirentsAccept.ts'

test('getNewDirentsAccept - create file in root', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.writeFile'() {
      return
    },
  })

  const items: readonly ExplorerItem[] = []
  const editingValue = 'test.txt'
  const focusedIndex = -1
  const root = '/root'
  const pathSeparator = '/'
  const newDirentType = DirentType.File
  const result = getNewDirentsAccept(items, focusedIndex, editingValue, root, pathSeparator, newDirentType)
  expect(result.dirents).toHaveLength(1)
  expect(result.dirents[0]).toEqual({
    depth: 1,
    icon: '',
    name: 'test.txt',
    path: '/root/test.txt',
    posInSet: 1,
    selected: false,
    setSize: 1,
    type: DirentType.File,
  })
  expect(result.newFocusedIndex).toBe(0)
  expect(mockRpc.invocations).toEqual([])
})

test('getNewDirentsAccept - create file in subfolder', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.writeFile'() {
      return
    },
  })

  const newDirentType = DirentType.File

  const editingValue = 'test.txt'
  const focusedIndex = 0
  const root = '/root'
  const pathSeparator = '/'
  const items = [
    {
      depth: 1,
      icon: '',
      name: 'folder',
      path: '/root/folder',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: 2,
    },
  ]

  const result = getNewDirentsAccept(items, focusedIndex, editingValue, root, pathSeparator, newDirentType)

  expect(result.dirents).toHaveLength(2)
  expect(result.dirents[1]).toEqual({
    depth: 2,
    icon: '',
    name: 'test.txt',
    path: '/root/folder/test.txt',
    posInSet: 1,
    selected: false,
    setSize: 1,
    type: DirentType.File,
  })
  expect(result.newFocusedIndex).toBe(1)
  expect(mockRpc.invocations).toEqual([])
})

test('getNewDirentsAccept - create nested file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {
      return
    },
    'FileSystem.writeFile'() {
      return
    },
  })

  const items: readonly ExplorerItem[] = []
  const editingValue = 'a/b/c/test.txt'
  const focusedIndex = -1
  const root = '/root'
  const pathSeparator = '/'
  const newDirentType = DirentType.File
  const result = getNewDirentsAccept(items, focusedIndex, editingValue, root, pathSeparator, newDirentType)
  expect(result.dirents).toHaveLength(1)
  expect(result.dirents[0]).toEqual({
    depth: 1,
    icon: '',
    name: 'a/b/c/test.txt',
    path: '/root/a/b/c/test.txt',
    posInSet: 1,
    selected: false,
    setSize: 1,
    type: DirentType.File,
  })
  expect(result.newFocusedIndex).toBe(0)
  expect(mockRpc.invocations).toEqual([])
})

test.skip('getNewDirentsAccept - handle error', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.writeFile'() {
      return Promise.reject(new Error('Failed to create file'))
    },
  })

  const editingValue = 'test.txt'
  const focusedIndex = -1
  const root = '/root'
  const pathSeparator = '/'
  const items: readonly ExplorerItem[] = []
  const newDirentType = DirentType.File

  const result = getNewDirentsAccept(items, focusedIndex, editingValue, root, pathSeparator, newDirentType)

  expect(result.dirents).toEqual(items)
  expect(result.newFocusedIndex).toBe(focusedIndex)
})
