import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import * as ViewletExplorer from '../src/parts/Create/Create.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ViewletExplorerFocusLast from '../src/parts/FocusLast/FocusLast.ts'

test('focusLast', () => {
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
  expect(ViewletExplorerFocusLast.focusLast(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusLast - no dirents', () => {
  const state: ExplorerState = {
    // @ts-ignore
    ...ViewletExplorer.create(1),
    focusedIndex: -1,
    items: [],
    root: '/home/test-user/test-path',
  }
  expect(ViewletExplorerFocusLast.focusLast(state)).toMatchObject({
    focusedIndex: -1,
  })
})

test('focusLast - focus already at last', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 1,
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
  expect(ViewletExplorerFocusLast.focusLast(state)).toBe(state)
})
