import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ViewletExplorerFocusNext from '../src/parts/FocusNext/FocusNext.ts'

test('focusNext', () => {
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
  expect(ViewletExplorerFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusNext - when no focus', () => {
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
  expect(ViewletExplorerFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusNext - at end', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 2,
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
  expect(ViewletExplorerFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 2,
  })
})
