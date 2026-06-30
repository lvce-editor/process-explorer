import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { collapseAll } from '../src/parts/CollapseAll/CollapseAll.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('collapseAll - empty state', async () => {
  const state: ExplorerState = createDefaultState()
  const result = await collapseAll(state)
  expect(result).toEqual(state)
})

test('collapseAll - with nested items', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    fileIconCache: {
      '/folder1': 'icon',
      '/folder1/file1.txt': 'icon',
      '/folder2': 'icon',
      '/folder2/file2.txt': 'icon',
    },
    items: [
      { depth: 1, name: 'folder1', path: '/folder1', selected: false, type: DirentType.Directory },
      { depth: 2, name: 'file1.txt', path: '/folder1/file1.txt', selected: false, type: DirentType.File },
      { depth: 1, name: 'folder2', path: '/folder2', selected: false, type: DirentType.Directory },
      { depth: 2, name: 'file2.txt', path: '/folder2/file2.txt', selected: false, type: DirentType.File },
    ],
  }

  const result = await collapseAll(state)
  expect(result).toEqual({
    ...state,
    items: [
      { depth: 1, name: 'folder1', path: '/folder1', selected: false, type: DirentType.Directory },
      { depth: 1, name: 'folder2', path: '/folder2', selected: false, type: DirentType.Directory },
    ],
  })
})
