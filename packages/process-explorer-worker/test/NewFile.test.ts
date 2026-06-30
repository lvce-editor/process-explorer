import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { newFile } from '../src/parts/NewFile/NewFile.ts'

test('newFile', async () => {
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
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'(requests: readonly any[]) {
      return requests.map((param) => {
        if (param.type === 2) {
          return `folder-icon`
        }
        return `file-icon`
      })
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getPath'() {
      return '/new/path'
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'testfolder', path: '/testfolder', selected: false, type: DirentType.Directory }],
    maxLineY: 1,
  }

  const result = await newFile(state)
  expect(result).toEqual({
    ...state,
    editingIndex: 1,
    editingType: ExplorerEditingType.CreateFile,
    editingValue: '',
    focus: 2,
    focusedIndex: 1,
    items: [
      {
        depth: 0,
        name: 'testfolder',
        path: '/testfolder',
        selected: false,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 1,
        icon: '',
        name: '',
        path: '/testfolder',
        posInSet: 1,
        selected: false,
        setSize: 2,
        type: DirentType.EditingFile,
      },
    ],
    visibleExplorerItems: expect.anything(),
  })
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/testfolder']])
})
