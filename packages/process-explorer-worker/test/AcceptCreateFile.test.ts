import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { acceptCreateFile } from '../src/parts/AcceptCreateFile/AcceptCreateFile.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('acceptCreateFile', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.createFile'() {},
    'FileSystem.readDirWithFileTypes'(...params: any[]) {
      const path = params[0]
      if (path === '/test') {
        return [{ name: 'folder1', type: DirentType.Directory }]
      }
      return []
    },
    'FileSystem.writeFile'() {},
    'IconTheme.getFolderIcon'() {
      return 'folder-icon'
    },
    'IconTheme.getIcons'() {
      return ['folder-icon']
    },
    'Main.openUri'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 0,
    editingValue: 'test.txt',
    items: [
      {
        depth: 0,
        name: 'test',
        path: 'test',
        selected: false,
        type: 1,
      },
    ],
    root: '/test',
  }
  const newState = await acceptCreateFile(state)
  expect(newState.editingIndex).toBe(-1)
  expect(newState.editingType).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.writeFile', 'test/test.txt', ''],
    ['Layout.handleWorkspaceRefresh'],
    ['Main.openUri', 'test/test.txt', true],
  ])
})
