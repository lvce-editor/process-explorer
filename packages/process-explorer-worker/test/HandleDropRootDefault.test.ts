import { test, expect } from '@jest/globals'
import { RendererWorker, SourceControlWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import type { DroppedArgs } from '../src/parts/UploadFileSystemHandles/UploadFileSystemHandles.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleDrop } from '../src/parts/HandleDropRootDefault/HandleDropRootDefault.ts'

test('handleDropRootDefault opens dropped folder as workspace when workspace is empty', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return [{ isDirectory: false, isFile: true, name: 'inside.txt' }]
    },
    'PersistentFileHandle.addHandle'() {
      return undefined
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getPath'() {
      return 'html://dropped-folder'
    },
    'Workspace.setPath'() {
      return undefined
    },
  })
  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '',
  }
  const fileHandle = {
    kind: 'directory',
    name: 'dropped-folder',
  } as FileSystemDirectoryHandle
  const fileHandles: DroppedArgs = [fileHandle]

  const result = await handleDrop(state, fileHandles, [], [])

  expect(result.root).toBe('html://dropped-folder')
  expect(result.dropTargets).toEqual([])
  expect(result.items).toHaveLength(1)
  expect(mockRpc.invocations).toEqual([
    ['PersistentFileHandle.addHandle', 'dropped-folder', fileHandle],
    ['Workspace.setPath', 'html://dropped-folder'],
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
    ['Preferences.get', 'explorer.sourceControlDecorations'],
    ['Workspace.getPath'],
    ['FileSystem.getPathSeparator', 'html://dropped-folder'],
    ['FileSystem.readDirWithFileTypes', 'html://dropped-folder'],
  ])
  expect(mockSourceControlRpc.invocations).toEqual([])
})

test('handleDropRootDefault opens first dropped folder as workspace when two folders are dropped into empty workspace', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return [{ isDirectory: false, isFile: true, name: 'inside.txt' }]
    },
    'PersistentFileHandle.addHandle'() {
      return undefined
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getPath'() {
      return 'html://first-folder'
    },
    'Workspace.setPath'() {
      return undefined
    },
  })
  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '',
  }
  const firstFolderHandle = {
    kind: 'directory',
    name: 'first-folder',
  } as FileSystemDirectoryHandle
  const secondFolderHandle = {
    kind: 'directory',
    name: 'second-folder',
  } as FileSystemDirectoryHandle
  const fileHandles: DroppedArgs = [firstFolderHandle, secondFolderHandle]

  const result = await handleDrop(state, fileHandles, [], [])

  expect(result.root).toBe('html://first-folder')
  expect(result.dropTargets).toEqual([])
  expect(result.items).toHaveLength(1)
  expect(mockRpc.invocations).toEqual([
    ['PersistentFileHandle.addHandle', 'first-folder', firstFolderHandle],
    ['Workspace.setPath', 'html://first-folder'],
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
    ['Preferences.get', 'explorer.sourceControlDecorations'],
    ['Workspace.getPath'],
    ['FileSystem.getPathSeparator', 'html://first-folder'],
    ['FileSystem.readDirWithFileTypes', 'html://first-folder'],
  ])
  expect(mockSourceControlRpc.invocations).toEqual([])
})

test('handleDropRootDefault ignores dropped file when workspace is empty', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '',
  }
  const fileHandle = {
    kind: 'file',
    name: 'dropped-file.txt',
  } as FileSystemFileHandle
  const fileHandles: DroppedArgs = [fileHandle]

  const result = await handleDrop(state, fileHandles, [], [])

  expect(result.root).toBe('')
  expect(result.dropTargets).toEqual([])
  expect(result.items).toEqual([])
  expect(mockRpc.invocations).toEqual([])
})

test('handleDropRootDefault opens dropped folder as workspace when file and folder are dropped into empty workspace', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return [{ isDirectory: false, isFile: true, name: 'folder-inside.txt' }]
    },
    'PersistentFileHandle.addHandle'() {
      return undefined
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getPath'() {
      return 'html://dropped-folder'
    },
    'Workspace.setPath'() {
      return undefined
    },
  })
  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '',
  }
  const fileHandle = {
    kind: 'file',
    name: 'dropped-file.txt',
  } as FileSystemFileHandle
  const directoryHandle = {
    kind: 'directory',
    name: 'dropped-folder',
  } as FileSystemDirectoryHandle
  const fileHandles: DroppedArgs = [fileHandle, directoryHandle]

  const result = await handleDrop(state, fileHandles, [], [])

  expect(result.root).toBe('html://dropped-folder')
  expect(result.dropTargets).toEqual([])
  expect(result.items).toHaveLength(1)
  expect(mockRpc.invocations).toEqual([
    ['PersistentFileHandle.addHandle', 'dropped-folder', directoryHandle],
    ['Workspace.setPath', 'html://dropped-folder'],
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
    ['Preferences.get', 'explorer.sourceControlDecorations'],
    ['Workspace.getPath'],
    ['FileSystem.getPathSeparator', 'html://dropped-folder'],
    ['FileSystem.readDirWithFileTypes', 'html://dropped-folder'],
  ])
  expect(mockSourceControlRpc.invocations).toEqual([])
})
