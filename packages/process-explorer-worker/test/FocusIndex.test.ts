import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ViewletExplorerFocusIndex from '../src/parts/FocusIndex/FocusIndex.ts'

test('focusIndex - scroll up', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    deltaY: 0,
    focusedIndex: 1,
    height: 600,
    items: [
      {
        depth: 1,
        name: 'index.css',
        path: '/index.css',
        selected: false,
        type: DirentType.File,
      },
      {
        depth: 1,
        name: 'index.html',
        path: '/index.html',
        selected: true,
        type: DirentType.File,
      },
    ],
    maxLineY: 2,
    minLineY: 1,
    root: '/home/test-user/test-path',
  }
  expect(ViewletExplorerFocusIndex.focusIndex(state, 0)).toMatchObject({
    focusedIndex: 0,
    items: [
      {
        selected: false,
      },
      {
        selected: false,
      },
    ],
    maxLineY: 1,
    minLineY: 0,
  })
})

test('focusIndex - scroll down', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 1,
        name: 'index.css',
        path: '/index.css',
        selected: true,
        type: DirentType.File,
      },
      {
        depth: 1,
        name: 'index.html',
        path: '/index.html',
        selected: false,
        type: DirentType.File,
      },
    ],
    maxLineY: 1,
    minLineY: 0,
    root: '/home/test-user/test-path',
  }
  expect(ViewletExplorerFocusIndex.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
    items: [
      {
        selected: false,
      },
      {
        selected: false,
      },
    ],
    maxLineY: 2,
    minLineY: 1,
  })
})

test('focusIndex - focus container', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 1,
        name: 'index.css',
        path: '/index.css',
        selected: true,
        type: DirentType.File,
      },
      {
        depth: 1,
        name: 'index.html',
        path: '/index.html',
        selected: false,
        type: DirentType.File,
      },
    ],
    maxLineY: 1,
    minLineY: 0,
  }
  expect(ViewletExplorerFocusIndex.focusIndex(state, -1)).toMatchObject({
    focusedIndex: -1,
    items: [
      {
        selected: false,
      },
      {
        selected: false,
      },
    ],
    maxLineY: 1,
    minLineY: 0,
  })
})

test('focusIndex - unselects all other items', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 1,
        name: 'index.css',
        path: '/index.css',
        selected: true,
        type: DirentType.File,
      },
      {
        depth: 1,
        name: 'index.html',
        path: '/index.html',
        selected: true,
        type: DirentType.File,
      },
      {
        depth: 1,
        name: 'index.js',
        path: '/index.js',
        selected: true,
        type: DirentType.File,
      },
    ],
    maxLineY: 3,
    minLineY: 0,
  }
  expect(ViewletExplorerFocusIndex.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
    items: [
      {
        selected: false,
      },
      {
        selected: false,
      },
      {
        selected: false,
      },
    ],
  })
})
