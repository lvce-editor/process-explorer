import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { handleDoubleClick } from '../src/parts/HandleDoubleClick/HandleDoubleClick.ts'

test('handleDoubleClick - double click on empty area creates new file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Focus.setFocus'() {
      return undefined
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'(requests: readonly any[]) {
      return requests.map((param) => {
        if (param.type === 2) {
          return `folder-icon`
        }
        return `file-icon`
      })
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getPath'() {
      return '/new/path'
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    itemHeight: 20,
    items: [{ depth: 0, name: 'testfolder', path: '/testfolder', selected: false, type: DirentType.Directory }],
    maxLineY: 1,
    minLineY: 0,
    y: 0,
  }

  // Double click on empty area (position that doesn't match any item)
  const result = await handleDoubleClick(state, 0, 100)
  expect(result).toEqual({
    ...state,
    editingIndex: 1,
    editingType: ExplorerEditingType.CreateFile,
    editingValue: '',
    focus: 2,
    focusedIndex: 1,
    items: [
      {
        depth: 0,
        name: 'testfolder',
        path: '/testfolder',
        selected: false,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 1,
        icon: '',
        name: '',
        path: '/testfolder',
        posInSet: 1,
        selected: false,
        setSize: 2,
        type: DirentType.EditingFile,
      },
    ],
    visibleExplorerItems: expect.anything(),
  })
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/testfolder']])
})

test('handleDoubleClick - double click on item returns same state', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    itemHeight: 20,
    items: [{ depth: 0, name: 'testfolder', path: '/testfolder', selected: false, type: DirentType.Directory }],
    maxLineY: 1,
    minLineY: 0,
    y: 0,
  }

  // Double click on item (position that matches an item)
  const result = await handleDoubleClick(state, 0, 10)
  expect(result).toBe(state)
})

test('handleDoubleClick - double click on item with multiple items returns same state', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    itemHeight: 20,
    items: [
      { depth: 0, name: 'folder1', path: '/folder1', selected: false, type: DirentType.Directory },
      { depth: 0, name: 'folder2', path: '/folder2', selected: false, type: DirentType.Directory },
    ],
    maxLineY: 2,
    minLineY: 0,
    y: 0,
  }

  // Double click on first item
  const result = await handleDoubleClick(state, 0, 10)
  expect(result).toBe(state)

  // Double click on second item
  const result2 = await handleDoubleClick(state, 0, 30)
  expect(result2).toBe(state)
})

test('handleDoubleClick - double click on empty area with scrolled state creates new file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Focus.setFocus'() {
      return undefined
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'(requests: readonly any[]) {
      return requests.map((param) => {
        if (param.type === 2) {
          return `folder-icon`
        }
        return `file-icon`
      })
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getPath'() {
      return '/new/path'
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    itemHeight: 20,
    items: [{ depth: 0, name: 'testfolder', path: '/testfolder', selected: false, type: DirentType.Directory }],
    maxLineY: 1,
    minLineY: 0,
    y: 0,
  }

  // Double click on empty area with scrolled position
  const result = await handleDoubleClick(state, 0, 100)
  expect(result).toEqual({
    ...state,
    editingIndex: 1,
    editingType: ExplorerEditingType.CreateFile,
    editingValue: '',
    focus: 2,
    focusedIndex: 1,
    items: [
      {
        depth: 0,
        name: 'testfolder',
        path: '/testfolder',
        selected: false,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 1,
        icon: '',
        name: '',
        path: '/testfolder',
        posInSet: 1,
        selected: false,
        setSize: 2,
        type: DirentType.EditingFile,
      },
    ],
    visibleExplorerItems: expect.anything(),
  })
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/testfolder']])
})
