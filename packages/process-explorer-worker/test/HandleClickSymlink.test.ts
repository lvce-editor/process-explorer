import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleClickSymLink } from '../src/parts/HandleClickSymlink/HandleClickSymlink.ts'

test('handleClickSymLink - file symlink', async () => {
  const state: ExplorerState = createDefaultState()
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'symlink',
    path: '/test/symlink',
    selected: false,
    type: DirentType.Symlink,
  }
  const index = 0

  const mockRealPath = '/test/real-file'
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getRealPath'() {
      return mockRealPath
    },
    'FileSystem.stat'() {
      return DirentType.File
    },
    'Main.openUri'() {
      return undefined
    },
  })

  await handleClickSymLink(state, dirent, index)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.getRealPath', '/test/symlink'],
    ['FileSystem.stat', '/test/real-file'],
    ['Main.openUri', '/test/symlink', true],
  ])
})

test('handleClickSymLink - unsupported type', async () => {
  const state: ExplorerState = createDefaultState()
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'symlink',
    path: '/test/symlink',
    selected: false,
    type: DirentType.Symlink,
  }
  const index = 0

  const mockRealPath = '/test/real-file'
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getRealPath'() {
      return mockRealPath
    },
    'FileSystem.stat'() {
      return DirentType.Directory
    },
  })

  await expect(handleClickSymLink(state, dirent, index)).rejects.toThrow('unsupported file type')
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.getRealPath', '/test/symlink'],
    ['FileSystem.stat', '/test/real-file'],
  ])
})
