import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getNewDirentsForNewDirent } from '../src/parts/GetNewDirentsForNewDirent/GetNewDirentsForNewDirent.ts'

test('getNewDirentsForNewDirent - folder with existing children', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const defaultState = createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    focusedIndex: 0,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder',
        path: '/root/folder',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'file1.txt',
        path: '/root/folder/file1.txt',
        posInSet: 1,
        selected: false,
        setSize: 2,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'file2.txt',
        path: '/root/folder/file2.txt',
        posInSet: 2,
        selected: false,
        setSize: 2,
        type: DirentType.File,
      },
    ],
  }
  const root = '/root'

  const result = await getNewDirentsForNewDirent(state.items, state.focusedIndex, DirentType.File, root)

  expect(result).toEqual([
    {
      depth: 1,
      icon: '',
      name: 'folder',
      path: '/root/folder',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 2,
      icon: '',
      name: 'file1.txt',
      path: '/root/folder/file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 4,
      type: DirentType.File,
    },
    {
      depth: 2,
      icon: '',
      name: 'file2.txt',
      path: '/root/folder/file2.txt',
      posInSet: 2,
      selected: false,
      setSize: 4,
      type: DirentType.File,
    },
    {
      depth: 2,
      icon: '',
      name: '',
      path: '/root/folder',
      posInSet: 3,
      selected: false,
      setSize: 4,
      type: DirentType.File,
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test('getNewDirentsForNewDirent - folder without children', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const defaultState = createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    focusedIndex: 0,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder',
        path: '/root/folder',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
    ],
  }

  const root = '/root'

  const result = await getNewDirentsForNewDirent(state.items, state.focusedIndex, DirentType.File, root)

  expect(result).toEqual([
    {
      depth: 1,
      icon: '',
      name: 'folder',
      path: '/root/folder',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 2,
      icon: '',
      name: '',
      path: '/root/folder',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: DirentType.File,
    },
  ])
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/root/folder']])
})

test('getNewDirentsForNewDirent - no items', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const defaultState = createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    focusedIndex: -1,
    items: [],
  }
  const root = '/root'

  const result = await getNewDirentsForNewDirent(state.items, state.focusedIndex, DirentType.File, root)

  expect(result).toEqual([
    {
      depth: 0,
      icon: '',
      name: '',
      path: '/root',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.File,
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test('getNewDirentsForNewDirent - focusedIndex -1 with existing items', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const defaultState = createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    focusedIndex: -1,
    items: [
      {
        depth: 0,
        icon: '',
        name: 'file1.txt',
        path: '/root/file1.txt',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  }
  const root = '/root'

  const result = await getNewDirentsForNewDirent(state.items, state.focusedIndex, DirentType.File, root)

  expect(result).toEqual([
    {
      depth: 0,
      icon: '',
      name: 'file1.txt',
      path: '/root/file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.File,
    },
    {
      depth: 0,
      icon: '',
      name: '',
      path: '/root',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.File,
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})
