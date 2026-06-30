import { test, expect } from '@jest/globals'
import { jest } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { Directory, DirectoryExpanded, File } from '../src/parts/DirentType/DirentType.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { removeDirent } from '../src/parts/RemoveDirent/RemoveDirent.ts'

test('removeDirent - removes focused item', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.remove'() {
      return
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
    confirmDelete: false,
    focusedIndex: 0,
    items: [{ depth: 0, name: 'file1.txt', path: '/file1.txt', selected: false, type: File }],
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.remove', '/file1.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('removeDirent - removes multiple selected items', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.remove'() {
      return
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
    confirmDelete: false,
    focusedIndex: 0,
    items: [
      { depth: 0, name: 'file1.txt', path: '/file1.txt', selected: true, type: File },
      { depth: 0, name: 'file2.txt', path: '/file2.txt', selected: true, type: File },
    ],
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.remove', '/file1.txt'],
    ['FileSystem.remove', '/file2.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('removeDirent - removes focused item and selected items', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.remove'() {
      return
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
    confirmDelete: false,
    focusedIndex: 0,
    items: [
      { depth: 0, name: 'file1.txt', path: '/file1.txt', selected: false, type: File },
      { depth: 0, name: 'file2.txt', path: '/file2.txt', selected: true, type: File },
      { depth: 0, name: 'file3.txt', path: '/file3.txt', selected: true, type: File },
    ],
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.remove', '/file1.txt'],
    ['FileSystem.remove', '/file2.txt'],
    ['FileSystem.remove', '/file3.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('remove file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [{ name: 'folder1', type: DirentType.Directory }]
    },
    'FileSystem.remove'() {
      return
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
    confirmDelete: false,
    focusedIndex: 1,
    items: [
      { depth: 0, name: 'folder1', path: '/folder1', selected: false, type: Directory },
      { depth: 0, name: 'file1.txt', path: '/file1.txt', selected: false, type: File },
    ],
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(1)
  expect(result.items[0].name).toBe('folder1')
  expect(result.focusedIndex).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.remove', '/file1.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('remove folder with children', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.remove'() {
      return
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
    confirmDelete: false,
    focusedIndex: 0,
    items: [
      { depth: 0, name: 'folder1', path: '/folder1', selected: false, type: DirectoryExpanded },
      { depth: 1, name: 'file1.txt', path: '/folder1/file1.txt', selected: false, type: File },
    ],
    root: '/',
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
})

test('remove file from expanded folder', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/') {
        return [{ name: 'folder1', type: DirentType.Directory }]
      }
      if (path === '/folder1') {
        return []
      }
      return []
    },
    'FileSystem.remove'() {
      return
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
    confirmDelete: false,
    focusedIndex: 1,
    items: [
      { depth: 0, name: 'folder1', path: '/folder1', selected: false, type: DirectoryExpanded },
      { depth: 1, name: 'file1.txt', path: '/folder1/file1.txt', selected: false, type: File },
    ],
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(1)
  expect(result.items[0].name).toBe('folder1')
  expect(result.items[0].type).toBe(DirectoryExpanded)
  expect(result.focusedIndex).toBe(0)
})

test.skip('removeDirent - with confirmation enabled and user confirms', async () => {
  RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'(_message?: string) {
      return true
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.remove'() {
      return
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
    confirmDelete: false,
    focusedIndex: 0,
    items: [{ depth: 0, name: 'file1.txt', path: '/file1.txt', selected: false, type: File }],
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
})

test.skip('removeDirent - with confirmation enabled and user cancels', async () => {
  RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'(_message?: string) {
      return false
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    confirmDelete: false,
    focusedIndex: 0,
    items: [
      { depth: 0, name: 'file1.txt', path: '/file1.txt', selected: true, type: File },
      { depth: 0, name: 'file2.txt', path: '/file2.txt', selected: true, type: File },
    ],
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(2)
  expect(result.focusedIndex).toBe(0)
})

test('removeDirent - shows error message when file operation fails', async () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  const confirmFn = jest.fn()
  confirmFn.mockImplementation(() => true)
  RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'(message?: string) {
      return confirmFn(message)
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.remove'() {
      throw new Error('Permission denied')
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
    confirmDelete: false,
    focusedIndex: 0,
    items: [{ depth: 0, name: 'file1.txt', path: '/file1.txt', selected: false, type: File }],
  }

  const result = await removeDirent(state)
  expect(result).toBe(state)
  expect(confirmFn).toHaveBeenCalledWith('Error: Permission denied')
  expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
  expect(consoleErrorSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      message: expect.stringContaining('Failed to apply file operations: Permission denied'),
    }),
  )
  consoleErrorSpy.mockRestore()
})

test('removeDirent - shows error message for multiple files when operation fails', async () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  const confirmFn = jest.fn()
  confirmFn.mockImplementation(() => true)
  RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'(message?: string) {
      return confirmFn(message)
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.remove'() {
      throw new Error('Access denied')
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
    confirmDelete: false,
    focusedIndex: 0,
    items: [
      { depth: 0, name: 'file1.txt', path: '/file1.txt', selected: true, type: File },
      { depth: 0, name: 'file2.txt', path: '/file2.txt', selected: true, type: File },
    ],
  }

  const result = await removeDirent(state)
  expect(result).toBe(state)
  expect(confirmFn).toHaveBeenCalledWith('Error: Access denied')
  expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
  expect(consoleErrorSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      message: expect.stringContaining('Failed to apply file operations: Access denied'),
    }),
  )
  consoleErrorSpy.mockRestore()
})

test('removeDirent - continues normally when no error occurs', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.remove'() {
      return
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
    confirmDelete: false,
    focusedIndex: 0,
    items: [{ depth: 0, name: 'file1.txt', path: '/file1.txt', selected: false, type: File }],
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
})
