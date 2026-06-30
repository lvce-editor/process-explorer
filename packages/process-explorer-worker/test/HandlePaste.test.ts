import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handlePaste } from '../src/parts/HandlePaste/HandlePaste.ts'
import * as NativeFileTypes from '../src/parts/NativeFileTypes/NativeFileTypes.ts'

test('should handle paste with no files (none type)', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.readNativeFiles'() {
      return {
        files: [],
        type: NativeFileTypes.None,
      }
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handlePaste(initialState)

  expect(result).toBe(initialState)
  expect(mockRpc.invocations).toEqual([['ClipBoard.readNativeFiles']])
})

test('should handle paste with copy type', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.readNativeFiles'() {
      return {
        files: ['/source/file1.txt', '/source/file2.txt'],
        type: NativeFileTypes.Copy,
      }
    },
    'FileSystem.copy'() {},
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
    'Preferences.get'() {
      return false
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handlePaste(initialState)

  expect(result).toBeDefined()
  expect(result).toHaveProperty('items')
  expect(result).toHaveProperty('icons')
  expect(mockRpc.invocations).toEqual([
    ['ClipBoard.readNativeFiles'],
    ['FileSystem.copy', '/source/file1.txt', '/file1.txt'],
    ['FileSystem.copy', '/source/file2.txt', '/file2.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('should handle paste with cut type', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.readNativeFiles'() {
      return {
        files: ['/source/file1.txt', '/source/file2.txt'],
        type: NativeFileTypes.Cut,
      }
    },
    'FileSystem.copy'() {},
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.rename'() {},
    'IconTheme.getIcons'() {
      return ['']
    },
    'Preferences.get'() {
      return false
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handlePaste(initialState)

  expect(result).toBeDefined()
  expect(result).toHaveProperty('items')
  expect(result).toHaveProperty('icons')
  expect(mockRpc.invocations).toEqual([
    ['ClipBoard.readNativeFiles'],
    ['FileSystem.copy', '/source/file1.txt', '/file1.txt'],
    ['FileSystem.copy', '/source/file2.txt', '/file2.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('should handle paste with multiple files', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.readNativeFiles'() {
      return {
        files: ['/source/file1.txt', '/source/file2.txt', '/source/folder1', '/source/folder2/file3.txt'],
        type: NativeFileTypes.Copy,
      }
    },
    'FileSystem.copy'() {},
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
    'Preferences.get'() {
      return false
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handlePaste(initialState)

  expect(result).toBeDefined()
  expect(result).toHaveProperty('items')
  expect(result).toHaveProperty('icons')
  expect(mockRpc.invocations).toEqual([
    ['ClipBoard.readNativeFiles'],
    ['FileSystem.copy', '/source/file1.txt', '/file1.txt'],
    ['FileSystem.copy', '/source/file2.txt', '/file2.txt'],
    ['FileSystem.copy', '/source/folder1', '/folder1'],
    ['FileSystem.copy', '/source/folder2/file3.txt', '/file3.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('should handle paste with empty files array', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.readNativeFiles'() {
      return {
        files: [],
        type: NativeFileTypes.Copy,
      }
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
    'Preferences.get'() {
      return false
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handlePaste(initialState)

  expect(result).toBeDefined()
  expect(result).toHaveProperty('items')
  expect(result).toHaveProperty('icons')
  expect(mockRpc.invocations).toEqual([['ClipBoard.readNativeFiles'], ['FileSystem.readDirWithFileTypes', '/']])
})

test('should preserve state properties when handling paste', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.readNativeFiles'() {
      return {
        files: ['/source/file.txt'],
        type: NativeFileTypes.Copy,
      }
    },
    'FileSystem.copy'() {},
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
    'Preferences.get'() {
      return false
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handlePaste(initialState)

  expect(result).toBeDefined()
  expect(result).toHaveProperty('items')
  expect(result).toHaveProperty('icons')
  expect(mockRpc.invocations).toEqual([
    ['ClipBoard.readNativeFiles'],
    ['FileSystem.copy', '/source/file.txt', '/file.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})
