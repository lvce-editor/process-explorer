import { test, expect } from '@jest/globals'
import { RendererWorker, SourceControlWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleWorkspaceChange } from '../src/parts/HandleWorkspaceChange/HandleWorkspaceChange.ts'

test('should update state with new workspace path and load content', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getPath'() {
      return '/new/workspace/path'
    },
  })

  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('/new/workspace/path')
  expect(result).toHaveProperty('items')
  expect(result).toHaveProperty('icons')
  expect(result).toHaveProperty('fileIconCache')
  expect(result).toHaveProperty('minLineY')
  expect(result).toHaveProperty('deltaY')
  expect(result).toHaveProperty('maxLineY')
  expect(result).toHaveProperty('pathSeparator')
  expect(result).toHaveProperty('excluded')
  expect(result).toHaveProperty('useChevrons')
  expect(mockRpc.invocations).toEqual([
    ['Workspace.getPath'],
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
    ['Preferences.get', 'explorer.sourceControlDecorations'],
    ['Workspace.getPath'],
    ['FileSystem.getPathSeparator', '/new/workspace/path'],
    ['FileSystem.readDirWithFileTypes', '/new/workspace/path'],
  ])
  expect(mockSourceControlRpc.invocations).toEqual([])
})

test('should preserve state properties when updating workspace', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Preferences.get'() {
      return true
    },
    'Workspace.getPath'() {
      return '/another/workspace'
    },
  })

  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.uid).toBe(initialState.uid)
  expect(result.parentUid).toBe(initialState.parentUid)
  expect(result.focusedIndex).toBe(initialState.focusedIndex)
  expect(result.focused).toBe(initialState.focused)
  expect(result.hoverIndex).toBe(initialState.hoverIndex)
  expect(result.x).toBe(initialState.x)
  expect(result.y).toBe(initialState.y)
  expect(result.width).toBe(initialState.width)
  expect(result.height).toBe(initialState.height)
  expect(result.version).toBe(initialState.version)
  expect(result.editingIndex).toBe(initialState.editingIndex)
  expect(result.itemHeight).toBe(initialState.itemHeight)
  expect(result.platform).toBe(initialState.platform)
  expect(result.focus).toBe(initialState.focus)
  expect(result.inputSource).toBe(initialState.inputSource)
  expect(result.focusWord).toBe(initialState.focusWord)
  expect(result.focusWordTimeout).toBe(initialState.focusWordTimeout)
  expect(result.finalDeltaY).toBe(initialState.finalDeltaY)
  expect(result.scrollBarHeight).toBe(initialState.scrollBarHeight)
  expect(result.handleOffset).toBe(initialState.handleOffset)
  expect(result.scrollBarActive).toBe(initialState.scrollBarActive)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['Workspace.getPath'],
      ['Preferences.get', 'explorer.useChevrons'],
      ['Preferences.get', 'explorer.confirmdelete'],
      ['Preferences.get', 'explorer.confirmpaste'],
      ['Preferences.get', 'explorer.sourceControlDecorations'],
      ['Workspace.getPath'],
      ['FileSystem.getPathSeparator', '/another/workspace'],
      ['FileSystem.readDirWithFileTypes', '/another/workspace'],
    ]),
  )
  expect(mockSourceControlRpc.invocations).toEqual([['SourceControl.getEnabledProviderIds', '', '/another/workspace', '', 0]])
})

test('should handle workspace path change with existing content', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return [
        { isDirectory: false, isFile: true, name: 'file1.txt' },
        { isDirectory: true, isFile: false, name: 'folder1' },
      ]
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getPath'() {
      return '/changed/workspace/path'
    },
  })

  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('/changed/workspace/path')
  expect(result.items).toHaveLength(2)
  expect(result.pathSeparator).toBe('/')
  expect(result.useChevrons).toBe(false)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['Workspace.getPath'],
      ['Preferences.get', 'explorer.useChevrons'],
      ['Preferences.get', 'explorer.confirmdelete'],
      ['Preferences.get', 'explorer.confirmpaste'],
      ['Preferences.get', 'explorer.sourceControlDecorations'],
      ['Workspace.getPath'],
      ['FileSystem.getPathSeparator', '/changed/workspace/path'],
      ['FileSystem.readDirWithFileTypes', '/changed/workspace/path'],
    ]),
  )
  expect(mockSourceControlRpc.invocations).toEqual([])
})

test('should handle workspace path change with chevrons enabled', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Preferences.get'() {
      return true
    },
    'Workspace.getPath'() {
      return '/chevron/workspace'
    },
  })

  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('/chevron/workspace')
  expect(result.useChevrons).toBe(true)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['Workspace.getPath'],
      ['Preferences.get', 'explorer.useChevrons'],
      ['Preferences.get', 'explorer.confirmdelete'],
      ['Preferences.get', 'explorer.confirmpaste'],
      ['Preferences.get', 'explorer.sourceControlDecorations'],
      ['Workspace.getPath'],
      ['FileSystem.getPathSeparator', '/chevron/workspace'],
      ['FileSystem.readDirWithFileTypes', '/chevron/workspace'],
    ]),
  )
  expect(mockSourceControlRpc.invocations).toEqual([['SourceControl.getEnabledProviderIds', '', '/chevron/workspace', '', 0]])
})

test('should handle different path separators', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '\\'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getPath'() {
      return 'C:\\windows\\workspace'
    },
  })

  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('C:\\windows\\workspace')
  expect(result.pathSeparator).toBe('\\')
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['Workspace.getPath'],
      ['Preferences.get', 'explorer.useChevrons'],
      ['Preferences.get', 'explorer.confirmdelete'],
      ['Preferences.get', 'explorer.confirmpaste'],
      ['Preferences.get', 'explorer.sourceControlDecorations'],
      ['Workspace.getPath'],
      ['FileSystem.getPathSeparator', 'C:\\windows\\workspace'],
      ['FileSystem.readDirWithFileTypes', 'C:\\windows\\workspace'],
    ]),
  )
  expect(mockSourceControlRpc.invocations).toEqual([])
})

test('should set load error state when reading folder fails', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      const error = Object.assign(new Error('Permission denied'), {
        code: 'EACCES',
      })
      throw error
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getPath'() {
      return '/restricted/workspace'
    },
  })

  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('/restricted/workspace')
  expect(result.hasError).toBe(true)
  expect(result.errorCode).toBe('EACCES')
  expect(result.errorMessage).toBe('permission was denied')
  expect(result.items).toEqual([])
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['Workspace.getPath'],
      ['Preferences.get', 'explorer.useChevrons'],
      ['Preferences.get', 'explorer.confirmdelete'],
      ['Preferences.get', 'explorer.confirmpaste'],
      ['Preferences.get', 'explorer.sourceControlDecorations'],
      ['Workspace.getPath'],
      ['FileSystem.getPathSeparator', '/restricted/workspace'],
      ['FileSystem.readDirWithFileTypes', '/restricted/workspace'],
    ]),
  )
  expect(mockSourceControlRpc.invocations).toEqual([])
})
