import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { handleBlur } from '../src/parts/HandleBlur/HandleBlur.ts'

test('handleBlur - when not editing, sets focused to false', async () => {
  const state: ExplorerState = createDefaultState()
  const newState = await handleBlur(state)
  expect(newState.focused).toBe(false)
})

test.skip('handleBlur - when editing, keeps state unchanged', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.writeFile'() {
      return
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return Array(1).fill('')
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 0,
    editingType: ExplorerEditingType.CreateFile,
    editingValue: 'created.txt',
    items: [
      {
        depth: 0,
        name: '1',
        path: '1',
        selected: false,
        type: DirentType.File,
      },
    ],
  }
  const newState = await handleBlur(state)
  expect(newState).toEqual({
    ...state,
    editingIndex: -1,
    editingType: 0,
    fileIconCache: {
      '1': '',
      '1/created.txt': '',
    },
    focus: 1,
    focusedIndex: 1,
    icons: ['', ''],
    maxLineY: 2,
  })
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.getPathSeparator'],
    ['FileSystem.writeFile', '1/created.txt', ''],
    ['IconTheme.getFileIcon', { depth: 0, name: '1', path: '1', selected: false, type: DirentType.File }],
    [
      'IconTheme.getIcons',
      [
        { depth: 0, name: '1', path: '1', selected: false, type: DirentType.File },
        { depth: 0, name: 'created.txt', path: '1/created.txt', selected: false, type: DirentType.File },
      ],
    ],
  ])
})
