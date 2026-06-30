import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { cancelEdit } from '../src/parts/CancelEdit/CancelEdit.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'

test('cancelEdit', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})
  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 1,
    editingType: ExplorerEditingType.CreateFile,
    editingValue: 'test.txt',
  }

  const result = await cancelEdit(state)
  expect(result).toEqual({
    ...state,
    editingIndex: -1,
    editingType: ExplorerEditingType.None,
    editingValue: '',
    focus: FocusId.List,
    focused: true,
    focusedIndex: -1,
  })
  expect(mockRpc.invocations).toEqual([])
})

test('cancelEdit - removes editing items', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getIcons'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 1,
    editingType: ExplorerEditingType.CreateFile,
    editingValue: 'test.txt',
    items: [
      {
        depth: 0,
        icon: '',
        name: 'file1.txt',
        path: '/file1.txt',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.File,
      },
      {
        depth: 0,
        icon: '',
        name: 'test.txt',
        path: '/test.txt',
        posInSet: 2,
        selected: false,
        setSize: 1,
        type: DirentType.EditingFile,
      },
      {
        depth: 0,
        icon: '',
        name: 'newfolder',
        path: '/newfolder',
        posInSet: 3,
        selected: false,
        setSize: 1,
        type: DirentType.EditingFolder,
      },
    ],
  }

  const result = await cancelEdit(state)
  expect(result.items).toHaveLength(1)
  expect(result.items[0].type).toBe(DirentType.File)
  expect(result).toEqual({
    ...state,
    editingIndex: -1,
    editingType: ExplorerEditingType.None,
    editingValue: '',
    focus: FocusId.List,
    focused: true,
    focusedIndex: 0,
    items: [state.items[0]],
  })
  expect(mockRpc.invocations).toEqual([])
})

test('cancelEdit - rename file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getIcons'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'test.txt',
    items: [
      {
        depth: 0,
        name: 'test.txt',
        path: '/test.txt',
        selected: false,
        type: DirentType.EditingFile,
      },
    ],
  }

  const result = await cancelEdit(state)
  expect(result).toEqual({
    ...state,
    editingIndex: -1,
    editingType: ExplorerEditingType.None,
    editingValue: '',
    focus: FocusId.List,
    focused: true,
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        name: 'test.txt',
        path: '/test.txt',
        selected: false,
        type: DirentType.File,
      },
    ],
  })
  expect(mockRpc.invocations).toEqual([])
})

test('cancelEdit - rename folder', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getIcons'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'test',
    items: [
      {
        depth: 0,
        name: 'test',
        path: '/test',
        selected: false,
        type: DirentType.EditingFolder,
      },
    ],
  }

  const result = await cancelEdit(state)
  expect(result).toEqual({
    ...state,
    editingIndex: -1,
    editingType: ExplorerEditingType.None,
    editingValue: '',
    focus: FocusId.List,
    focused: true,
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        name: 'test',
        path: '/test',
        selected: false,
        type: DirentType.Directory,
      },
    ],
  })
  expect(mockRpc.invocations).toEqual([])
})

test('cancelEdit - create file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getIcons'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 1,
    editingType: ExplorerEditingType.CreateFile,
    editingValue: 'test.txt',
    items: [
      {
        depth: 0,
        name: 'file1.txt',
        path: '/file1.txt',
        selected: false,
        type: DirentType.File,
      },
      {
        depth: 0,
        name: 'test.txt',
        path: '/test.txt',
        selected: false,
        type: DirentType.EditingFile,
      },
    ],
  }

  const result = await cancelEdit(state)
  expect(result.items).toHaveLength(1)
  expect(result.items[0].type).toBe(DirentType.File)
  expect(result).toEqual({
    ...state,
    editingIndex: -1,
    editingType: ExplorerEditingType.None,
    editingValue: '',
    focus: FocusId.List,
    focused: true,
    focusedIndex: 0,
    items: [state.items[0]],
  })
  expect(mockRpc.invocations).toEqual([])
})
