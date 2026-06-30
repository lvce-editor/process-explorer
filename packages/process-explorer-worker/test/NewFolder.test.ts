import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { newFolder } from '../src/parts/NewFolder/NewFolder.ts'

test('newFolder', async () => {
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
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return ['']
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getPath'() {
      return '/new/path'
    },
  })
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }

  const result = await newFolder(mockState)
  expect(result).toEqual({
    ...mockState,
    editingIndex: 0,
    editingType: ExplorerEditingType.CreateFolder,
    editingValue: '',
    focus: 2,
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        icon: '',
        name: '',
        path: '/',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: 103,
      },
    ],
  })
  expect(mockRpc.invocations).toEqual([])
})
