import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import { handleClickDirectory } from '../src/parts/HandleClickDirectory/HandleClickDirectory.ts'

test('handleClickDirectory - updates state with focus', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { isDirectory: false, isSymbolicLink: false, name: 'child1', path: '/test/child1' },
        { isDirectory: false, isSymbolicLink: false, name: 'child2', path: '/test/child2' },
      ]
    },
  })

  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.Directory,
  }
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [dirent],
  }
  const index = 0
  const keepFocus = true

  const newState = await handleClickDirectory(state, dirent, index, keepFocus)

  expect(newState.items).toHaveLength(3)
  expect(newState.items[0]).toBe(dirent)
  expect(newState.items[1].name).toBe('child1')
  expect(newState.items[2].name).toBe('child2')
  expect(newState.focusedIndex).toBe(0)
  expect(newState.focused).toBe(true)
  expect(newState.focus).toBe(FocusId.List)
  expect(dirent.type).toBe(DirentType.DirectoryExpanded)
  expect(dirent.icon).toBe('')
})

test('handleClickDirectory - updates state without focus', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { isDirectory: false, isSymbolicLink: false, name: 'child1', path: '/test/child1' },
        { isDirectory: false, isSymbolicLink: false, name: 'child2', path: '/test/child2' },
      ]
    },
  })

  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.Directory,
  }
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [dirent],
  }
  const index = 0
  const keepFocus = false

  const newState = await handleClickDirectory(state, dirent, index, keepFocus)

  expect(newState.items).toHaveLength(3)
  expect(newState.focusedIndex).toBe(0)
  expect(newState.focused).toBe(false)
  expect(newState.focus).toBe(FocusId.List)
  expect(dirent.type).toBe(DirentType.DirectoryExpanded)
  expect(dirent.icon).toBe('')
})

test('handleClickDirectory - with empty child dirents', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.Directory,
  }
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [dirent],
  }
  const index = 0
  const keepFocus = true

  const newState = await handleClickDirectory(state, dirent, index, keepFocus)

  expect(newState.items).toHaveLength(1)
  expect(newState.items[0]).toBe(dirent)
  expect(newState.focusedIndex).toBe(0)
  expect(newState.focused).toBe(true)
  expect(dirent.type).toBe(DirentType.DirectoryExpanded)
  expect(dirent.icon).toBe('')
})

test('handleClickDirectory - with multiple items in state', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [{ isDirectory: false, isSymbolicLink: false, name: 'child1', path: '/test/child1' }]
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'other', path: '/other', selected: false, type: DirentType.File },
      { depth: 0, name: 'test', path: '/test', selected: false, type: DirentType.Directory },
      { depth: 0, name: 'another', path: '/another', selected: false, type: DirentType.File },
    ],
  }
  const dirent = state.items[1]
  const index = 1
  const keepFocus = true

  const newState = await handleClickDirectory(state, dirent, index, keepFocus)

  expect(newState.items).toHaveLength(4)
  expect(newState.items[0].name).toBe('other')
  expect(newState.items[1]).toBe(dirent)
  expect(newState.items[2].name).toBe('child1')
  expect(newState.items[3].name).toBe('another')
  expect(newState.focusedIndex).toBe(1)
  expect(newState.focused).toBe(true)
  expect(dirent.type).toBe(DirentType.DirectoryExpanded)
  expect(dirent.icon).toBe('')
})

test('handleClickDirectory - dirent not found in items', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [{ isDirectory: false, isSymbolicLink: false, name: 'child1', path: '/test/child1' }]
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ depth: 0, name: 'other', path: '/other', selected: false, type: DirentType.File }],
  }
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.Directory,
  }
  const index = 0
  const keepFocus = true

  const newState = await handleClickDirectory(state, dirent, index, keepFocus)

  // Should return original state when dirent not found
  expect(newState).toBe(state)
})
