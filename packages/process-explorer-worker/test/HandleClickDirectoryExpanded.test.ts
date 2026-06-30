import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleClickDirectoryExpanded } from '../src/parts/HandleClickDirectoryExpanded/HandleClickDirectoryExpanded.ts'

test.skip('collapse expanded directory', async () => {
  const state: ExplorerState = createDefaultState()
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.Directory,
  }
  const index = 0
  const keepFocus = true

  const newState = await handleClickDirectoryExpanded(state, dirent, index, keepFocus)

  expect(newState.items).toHaveLength(1)
  expect(newState.focusedIndex).toBe(0)
  expect(newState.focused).toBe(true)
})

test('collapse expanded directory with children', async () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.Directory,
  }
  const child1: ExplorerItem = {
    depth: 1,
    name: 'child1',
    path: '/test/child1',
    selected: false,
    type: DirentType.File,
  }
  const child2: ExplorerItem = {
    depth: 1,
    name: 'child2',
    path: '/test/child2',
    selected: false,
    type: DirentType.File,
  }
  const state: ExplorerState = {
    ...createDefaultState(),
    fileIconCache: {
      '/test/': '',
      '/test/child1': '',
      '/test/child2': '',
    },
    items: [dirent, child1, child2],
  }
  const index = 0
  const keepFocus = true

  const newState = await handleClickDirectoryExpanded(state, dirent, index, keepFocus)

  expect(newState.items).toHaveLength(1)
  expect(newState.focusedIndex).toBe(0)
  expect(newState.focused).toBe(true)
})

test('collapse expanded directory with many items preserves icons', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const dirent = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.Directory,
  }
  const items = [dirent]
  const fileIconCache: Record<string, string> = { '/test/': 'folder-icon' }

  // Add 10 items with unique icons
  for (let i = 0; i < 10; i++) {
    const child: ExplorerItem = {
      depth: 1,
      name: `child${i}`,
      path: `/test/child${i}`,
      selected: false,
      type: DirentType.File,
    }
    items.push(child)
    fileIconCache[`/test/child${i}`] = `icon-${i}`
  }

  const state: ExplorerState = {
    ...createDefaultState(),
    fileIconCache,
    items,
  }
  const index = 0
  const keepFocus = true

  const newState = await handleClickDirectoryExpanded(state, dirent, index, keepFocus)

  expect(newState.items).toHaveLength(1)
  expect(newState.focusedIndex).toBe(0)
  expect(newState.focused).toBe(true)
  expect(newState.fileIconCache['/test/']).toBe('folder-icon')
  expect(mockRpc.invocations).toEqual([])
})

test('collapse expanded directory with scroll position adjustment', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const otherFolder: ExplorerItem = {
    depth: 0,
    name: '1',
    path: '/1',
    selected: false,
    type: DirentType.Directory,
  }

  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.Directory,
  }
  const items: ExplorerItem[] = [otherFolder, dirent]
  const fileIconCache: Record<string, string> = {
    '/1': 'folder-icon-1',
    '/test': 'folder-icon-2',
  }

  // Add 10 items with unique icons
  for (let i = 0; i < 5; i++) {
    const child: ExplorerItem = {
      depth: 1,
      name: `child${i}`,
      path: `/test/child${i}`,
      selected: false,
      type: DirentType.File,
    }
    items.push(child)
    fileIconCache[`/test/child${i}`] = `icon-${i}`
  }

  const state: ExplorerState = {
    ...createDefaultState(),
    deltaY: 20, // User has scrolled down
    fileIconCache,
    height: 100,
    itemHeight: 20,
    items,
    maxLineY: 6,
    minLineY: 1,
  }
  const index = 1
  const keepFocus = true

  const newState = await handleClickDirectoryExpanded(state, dirent, index, keepFocus)

  expect(newState.items).toHaveLength(2)
  expect(newState.focusedIndex).toBe(1)
  expect(newState.focused).toBe(true)
  expect(newState.minLineY).toBe(0)
  expect(newState.maxLineY).toBe(2)
  // After collapsing, since only one item remains and it fits in viewport,
  // scroll position should be reset to 0
  expect(newState.deltaY).toBe(0)
  expect(mockRpc.invocations).toEqual([])
})
