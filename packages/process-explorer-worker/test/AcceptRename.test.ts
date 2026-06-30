import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { acceptRename } from '../src/parts/AcceptRename/AcceptRename.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as ExplorerStrings from '../src/parts/ExplorerStrings/ExplorerStrings.ts'
import * as PathSeparatorType from '../src/parts/PathSeparatorType/PathSeparatorType.ts'

test('acceptRename - validates empty name', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingType: ExplorerEditingType.Rename,
    editingValue: '',
  }
  expect(await acceptRename(state)).toEqual({
    ...state,
    editingErrorMessage: ExplorerStrings.fileOrFolderNameMustBeProvided(),
  })
})

test('acceptRename - renames file and refreshes parent children', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'b.txt', type: DirentType.File },
        { name: 'c.txt', type: DirentType.File },
      ]
    },
    'FileSystem.rename'() {
      return
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'b.txt',
    items: [
      { depth: 1, icon: '', name: 'a.txt', path: '/test/a.txt', posInSet: 1, selected: false, setSize: 2, type: DirentType.File },
      { depth: 1, icon: '', name: 'c.txt', path: '/test/c.txt', posInSet: 2, selected: false, setSize: 2, type: DirentType.File },
    ],
    pathSeparator: PathSeparatorType.Slash,
    root: '/test',
  }

  const result = await acceptRename(state)
  expect(result.editingIndex).toBe(-1)
  expect(result.editingType).toBe(ExplorerEditingType.None)
  expect(result.editingValue).toBe('')
  expect(result.focusedIndex).toBe(0)
  expect(result.items).toEqual([
    { depth: 1, icon: '', name: 'b.txt', path: '/test/b.txt', posInSet: 1, selected: false, setSize: 2, type: DirentType.File },
    { depth: 1, icon: '', name: 'c.txt', path: '/test/c.txt', posInSet: 2, selected: false, setSize: 2, type: DirentType.File },
  ])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.rename', '/test/a.txt', '/test/b.txt'],
    ['FileSystem.readDirWithFileTypes', '/test'],
  ])
})

test.skip('acceptRename - basic file rename', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'b.txt', type: DirentType.File },
        { name: 'c.txt', type: DirentType.File },
      ]
    },
    'FileSystem.rename'() {
      return
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'b.txt',
    items: [
      { depth: 0, name: 'a.txt', path: '/test/a.txt', selected: false, type: DirentType.File },
      { depth: 0, name: 'c.txt', path: '/test/c.txt', selected: false, type: DirentType.File },
    ],
    pathSeparator: PathSeparatorType.Slash,
  }

  const result = await acceptRename(state)
  expect(result.items).toHaveLength(2)
  expect(result.items[0].name).toBe('b.txt')
  expect(result.items[0].path).toBe('/test/b.txt')
  expect(result.items[1].name).toBe('c.txt')
  expect(result.focusedIndex).toBe(0)
  expect(result.editingIndex).toBe(-1)
  expect(result.editingType).toBe(ExplorerEditingType.None)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['FileSystem.rename', '/test/a.txt', '/test/b.txt'],
      ['FileSystem.readDirWithFileTypes', '/test'],
    ]),
  )
})

test.skip('acceptRename - folder rename', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'folder2', type: DirentType.Directory },
        { name: 'file.txt', type: DirentType.File },
      ]
    },
    'FileSystem.rename'() {
      return
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'folder2',
    items: [
      { depth: 0, name: 'folder1', path: '/test/folder1', selected: false, type: DirentType.Directory },
      { depth: 0, name: 'file.txt', path: '/test/file.txt', selected: false, type: DirentType.File },
    ],
    pathSeparator: PathSeparatorType.Slash,
  }

  const result = await acceptRename(state)
  expect(result.items).toHaveLength(2)
  expect(result.items[0].name).toBe('folder2')
  expect(result.items[0].path).toBe('/test/folder2')
  expect(result.items[1].name).toBe('file.txt')
  expect(result.focusedIndex).toBe(0)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['FileSystem.rename', '/test/folder1', '/test/folder2'],
      ['FileSystem.readDirWithFileTypes', '/test'],
    ]),
  )
})

test.skip('acceptRename - nested file rename', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'b.txt', type: DirentType.File },
        { name: 'c.txt', type: DirentType.File },
      ]
    },
    'FileSystem.rename'() {
      return
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 1,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'b.txt',
    items: [
      { depth: 0, name: 'folder', path: '/test/folder', selected: false, type: DirentType.Directory },
      { depth: 1, name: 'a.txt', path: '/test/folder/a.txt', selected: false, type: DirentType.File },
      { depth: 1, name: 'c.txt', path: '/test/folder/c.txt', selected: false, type: DirentType.File },
    ],
    pathSeparator: PathSeparatorType.Slash,
  }

  const result = await acceptRename(state)
  expect(result.items).toHaveLength(3)
  expect(result.items[0].name).toBe('folder')
  expect(result.items[1].name).toBe('b.txt')
  expect(result.items[1].path).toBe('/test/folder/b.txt')
  expect(result.items[2].name).toBe('c.txt')
  expect(result.focusedIndex).toBe(1)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['FileSystem.rename', '/test/folder/a.txt', '/test/folder/b.txt'],
      ['FileSystem.readDirWithFileTypes', '/test/folder'],
    ]),
  )
})

test.skip('acceptRename - preserves nested items', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [{ name: 'folder2', type: DirentType.Directory }]
    },
    'FileSystem.rename'() {
      return
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'folder2',
    items: [
      { depth: 0, name: 'folder1', path: '/test/folder1', selected: false, type: DirentType.Directory },
      { depth: 1, name: 'nested.txt', path: '/test/folder1/nested.txt', selected: false, type: DirentType.File },
    ],
    pathSeparator: PathSeparatorType.Slash,
  }

  const result = await acceptRename(state)
  expect(result.items).toHaveLength(2)
  expect(result.items[0].name).toBe('folder2')
  expect(result.items[0].path).toBe('/test/folder2')
  expect(result.items[1].name).toBe('nested.txt')
  expect(result.items[1].path).toBe('/test/folder2/nested.txt')
  expect(result.focusedIndex).toBe(0)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['FileSystem.rename', '/test/folder1', '/test/folder2'],
      ['FileSystem.readDirWithFileTypes', '/test'],
    ]),
  )
})

test.skip('acceptRename - handles rename error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.rename'() {
      return Promise.reject(new Error('rename failed'))
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'b.txt',
    items: [{ depth: 0, name: 'a.txt', path: '/test/a.txt', selected: false, type: DirentType.File }],
    pathSeparator: PathSeparatorType.Slash,
  }

  const result = await acceptRename(state)
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['FileSystem.rename', '/test/a.txt', '/test/b.txt']])
})

test.skip('acceptRename - maintains sorting order', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'b.txt', type: DirentType.File },
        { name: 'folder', type: DirentType.Directory },
        { name: 'z.txt', type: DirentType.File },
      ]
    },
    'FileSystem.rename'() {
      return
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'b.txt',
    items: [
      { depth: 0, name: 'a.txt', path: '/test/a.txt', selected: false, type: DirentType.File },
      { depth: 0, name: 'folder', path: '/test/folder', selected: false, type: DirentType.Directory },
      { depth: 0, name: 'z.txt', path: '/test/z.txt', selected: false, type: DirentType.File },
    ],
    pathSeparator: PathSeparatorType.Slash,
  }

  const result = await acceptRename(state)
  expect(result.items).toHaveLength(3)
  expect(result.items[0].name).toBe('b.txt')
  expect(result.items[1].name).toBe('folder')
  expect(result.items[2].name).toBe('z.txt')
  expect(result.focusedIndex).toBe(0)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['FileSystem.rename', '/test/a.txt', '/test/b.txt'],
      ['FileSystem.readDirWithFileTypes', '/test'],
    ]),
  )
})
