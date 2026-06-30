import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ViewletExplorerFocusPrevious from '../src/parts/FocusPrevious/FocusPrevious.ts'

test('focusPrevious', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 1,
    height: 600,
    items: [
      {
        depth: 0,
        name: 'index.css',
        path: '/index.css',
        selected: false,
        type: DirentType.File,
      },
      {
        depth: 0,
        name: 'index.html',
        path: '/index.html',
        selected: false,
        type: DirentType.File,
      },
      {
        depth: 0,
        name: 'test-folder',
        path: '/test-folder',
        selected: false,
        type: DirentType.Directory,
      },
    ],
    root: '/home/test-user/test-path',
  }
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - at start', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    height: 600,
    items: [
      {
        depth: 0,
        name: 'index.css',
        path: '/index.css',
        selected: false,
        type: DirentType.File,
      },
      {
        depth: 0,
        name: 'index.html',
        path: '/index.html',
        selected: false,
        type: DirentType.File,
      },
      {
        depth: 0,
        name: 'test-folder',
        path: '/test-folder',
        selected: false,
        type: DirentType.Directory,
      },
    ],
    root: '/home/test-user/test-path',
  }
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - when no focus', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    height: 600,
    items: [
      {
        depth: 0,
        name: 'index.css',
        path: '/index.css',
        selected: false,
        type: DirentType.File,
      },
      {
        depth: 0,
        name: 'index.html',
        path: '/index.html',
        selected: false,
        type: DirentType.File,
      },
      {
        depth: 0,
        name: 'test-folder',
        path: '/test-folder',
        selected: false,
        type: DirentType.Directory,
      },
    ],
    root: '/home/test-user/test-path',
  }
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('focusPrevious - when no focus and no dirents', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    height: 600,
    items: [],
    root: '/home/test-user/test-path',
  }
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: -1,
  })
})
