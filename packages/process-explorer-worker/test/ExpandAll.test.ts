import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { expandAll } from '../src/parts/ExpandAll/ExpandAll.ts'

test('expandAll - no focused item', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'file1', path: '/dir1/file1', type: DirentType.File },
        { name: 'file2', path: '/dir1/file2', type: DirentType.File },
      ]
    },
    'IconTheme.getFileIcon'() {
      return ['icon1', 'icon2']
    },
    'IconTheme.getFolderIcon'() {
      return ['icon1', 'icon2']
    },
    'IconTheme.getIcons'() {
      return ['icon1', 'icon2']
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
  }
  const result = await expandAll(state)
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('expandAll - expand directories at same depth', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'file1', path: '/dir1/file1', type: DirentType.File },
        { name: 'file2', path: '/dir1/file2', type: DirentType.File },
      ]
    },
    'IconTheme.getFileIcon'() {
      return ['icon1', 'icon2']
    },
    'IconTheme.getFolderIcon'() {
      return ['icon1', 'icon2']
    },
    'IconTheme.getIcons'() {
      return ['icon1', 'icon2']
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      { depth: 0, name: 'dir1', path: '/dir1', selected: false, type: DirentType.Directory },
      { depth: 0, name: 'dir2', path: '/dir2', selected: false, type: DirentType.Directory },
    ],
  }

  const result = await expandAll(state)

  expect(result.items).toHaveLength(6)
  expect(result.items[0].type).toBe(DirentType.DirectoryExpanded)
  expect(result.items[1].type).toBe(DirentType.File)
  expect(result.items[2].name).toBe('file2')
  expect(result.items[3].name).toBe('dir2')
  expect(result.fileIconCache).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/dir1'],
    ['FileSystem.readDirWithFileTypes', '/dir2'],
  ])
})
