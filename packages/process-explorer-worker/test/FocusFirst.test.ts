import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ViewletExplorerFocusFirst from '../src/parts/FocusFirst/FocusFirst.ts'

test('focusFirst', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 1,
    height: 600,
    items: [
      {
        depth: 1,
        name: 'index.css',
        path: '/index.css',
        posInSet: 0,
        selected: false,
        setSize: 2,
        type: DirentType.File,
      },
      {
        depth: 1,
        name: 'index.html',
        path: '/index.html',
        posInSet: 1,
        selected: false,
        setSize: 2,
        type: DirentType.File,
      },
    ],
    root: '/home/test-user/test-path',
  }
  expect(ViewletExplorerFocusFirst.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusFirst - no dirents', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    height: 600,
    items: [],
    root: '/home/test-user/test-path',
  }
  expect(ViewletExplorerFocusFirst.focusFirst(state)).toBe(state)
})

test('focusFirst - focus already at first', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    height: 600,
    items: [
      {
        depth: 1,
        name: 'index.css',
        path: '/index.css',
        posInSet: 0,
        selected: false,
        setSize: 2,
        type: DirentType.File,
      },
      {
        depth: 1,
        name: 'index.html',
        path: '/index.html',
        posInSet: 1,
        selected: false,
        setSize: 2,
        type: DirentType.File,
      },
    ],
    root: '/home/test-user/test-path',
  }
  expect(ViewletExplorerFocusFirst.focusFirst(state)).toBe(state)
})
