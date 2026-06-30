import { expect, test } from '@jest/globals'
import { RendererWorker, SourceControlWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import type { DroppedArgs } from '../src/parts/UploadFileSystemHandles/UploadFileSystemHandles.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleDrop } from '../src/parts/HandleDropRootElectron/HandleDropRootElectron.ts'

test('handleDropRootElectron opens dropped folder as workspace when workspace is empty', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return [{ isDirectory: false, isFile: true, name: 'inside.txt' }]
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getPath'() {
      return '/home/simon/dotfiles'
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
    name: 'dotfiles',
  } as FileSystemDirectoryHandle
  const fileHandles: DroppedArgs = [fileHandle]

  const result = await handleDrop(state, fileHandles, [], ['/home/simon/dotfiles'])

  expect(result.root).toBe('/home/simon/dotfiles')
  expect(result.dropTargets).toEqual([])
  expect(result.items).toHaveLength(1)
  expect(mockRpc.invocations).toEqual([
    ['Workspace.setPath', '/home/simon/dotfiles'],
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
    ['Preferences.get', 'explorer.sourceControlDecorations'],
    ['Workspace.getPath'],
    ['FileSystem.getPathSeparator', '/home/simon/dotfiles'],
    ['FileSystem.readDirWithFileTypes', '/home/simon/dotfiles'],
  ])
  expect(mockSourceControlRpc.invocations).toEqual([])
})

test('handleDropRootElectron ignores dropped file when workspace is empty', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})
  const state: ExplorerState = {
    ...createDefaultState(),
    dropTargets: [0],
    root: '',
  }
  const fileHandles: DroppedArgs = [
    {
      kind: 'file',
      value: {
        kind: 'file',
        name: 'dropped-file.txt',
      } as FileSystemFileHandle,
    },
  ]

  const result = await handleDrop(state, fileHandles, [], ['/home/simon/dropped-file.txt'])

  expect(result.root).toBe('')
  expect(result.dropTargets).toEqual([])
  expect(result.items).toEqual([])
  expect(mockRpc.invocations).toEqual([])
})
