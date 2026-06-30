import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleArrowRightDirectoryExpanded } from '../src/parts/HandleArrowRightDirectoryExpanded/HandleArrowRightDirectoryExpanded.ts'

test.skip('handleArrowRightDirectoryExpanded - last item', () => {
  const state: ExplorerState = createDefaultState()
  const dirent = { depth: 0 }
  const result = handleArrowRightDirectoryExpanded(state, dirent)
  expect(result).toBe(state)
})

test('handleArrowRightDirectoryExpanded - next item has higher depth', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      { depth: 0, name: 'a', path: '/a', selected: false, type: 1 },
      { depth: 1, name: 'b', path: '/b', selected: false, type: 1 },
    ],
  }
  const dirent = { depth: 0 }
  const result = handleArrowRightDirectoryExpanded(state, dirent)
  expect(result.focusedIndex).toBe(1)
})

test('handleArrowRightDirectoryExpanded - next item has same depth', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      { depth: 0, name: 'a', path: '/a', selected: false, type: 1 },
      { depth: 0, name: 'b', path: '/b', selected: false, type: 1 },
    ],
  }
  const dirent = { depth: 0 }
  const result = handleArrowRightDirectoryExpanded(state, dirent)
  expect(result).toBe(state)
})
