import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { handleButtonClick } from '../src/parts/HandleButtonClick/HandleButtonClick.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'

test('handleButtonClick - CollapseAll', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 1,
    items: [
      { depth: 1, name: 'folder1', path: '/folder1', selected: false, type: DirentType.DirectoryExpanded },
      { depth: 2, name: 'file1', path: '/folder1/file1', selected: false, type: DirentType.File },
      { depth: 1, name: 'folder2', path: '/folder2', selected: false, type: DirentType.DirectoryExpanded },
    ],
  }
  const newState = await handleButtonClick(state, InputName.CollapseAll)
  expect(newState.items).toHaveLength(2)
  expect(newState.items[0].name).toBe('folder1')
  expect(newState.items[1].name).toBe('folder2')
  expect(newState.focusedIndex).toBe(0)
})

test('handleButtonClick - NewFile', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 1, name: 'folder1', path: '/folder1', selected: false, type: DirentType.Directory }],
  }
  const newState = await handleButtonClick(state, InputName.NewFile)
  expect(newState.editingType).toBe(ExplorerEditingType.CreateFile)
  expect(newState.editingIndex).toBeGreaterThanOrEqual(0)
  expect(newState.editingValue).toBe('')
})

test('handleButtonClick - NewFolder', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 1, name: 'folder1', path: '/folder1', selected: false, type: DirentType.Directory }],
  }
  const newState = await handleButtonClick(state, InputName.NewFolder)
  expect(newState.editingType).toBe(ExplorerEditingType.CreateFolder)
  expect(newState.editingIndex).toBeGreaterThanOrEqual(0)
  expect(newState.editingValue).toBe('')
})

test('handleButtonClick - Refresh', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readdir'() {
      return []
    },
    'FileSystem.stat'() {
      return DirentType.File
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return Array(1).fill('')
    },
  })

  const state = createDefaultState()
  const newState = await handleButtonClick(state, InputName.Refresh)
  expect(newState.items).toBeDefined()
})

test('handleButtonClick - unknown button name returns state unchanged', async () => {
  const state = createDefaultState()
  const newState = await handleButtonClick(state, 'UnknownButton')
  expect(newState).toBe(state)
})
