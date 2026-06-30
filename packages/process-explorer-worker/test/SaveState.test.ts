import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'
import { saveState } from '../src/parts/SaveState/SaveState.ts'

test('saveState - returns correct saved state', () => {
  const uid = 1
  const oldState = createDefaultState()
  const newState: ExplorerState = {
    ...oldState,
    deltaY: 0,
    items: [
      { depth: 0, name: 'test', path: '/test', selected: false, type: DirentType.DirectoryExpanded },
      { depth: 1, name: 'file.txt', path: '/test/file.txt', selected: false, type: DirentType.File },
    ],
    maxLineY: 100,
    minLineY: 0,
    root: '/',
  }
  ExplorerStates.set(uid, oldState, newState)

  const result = saveState(newState)

  expect(result).toEqual({
    deltaY: 0,
    expandedPaths: ['/test'],
    maxLineY: 100,
    minLineY: 0,
    root: '/',
  })
})

test('saveState - handles empty items', () => {
  const uid = 1
  const oldState = createDefaultState()
  const newState: ExplorerState = {
    ...oldState,
    deltaY: 0,
    items: [],
    maxLineY: 0,
    minLineY: 0,
    root: '/',
  }
  ExplorerStates.set(uid, oldState, newState)

  const result = saveState(newState)

  expect(result).toEqual({
    deltaY: 0,
    expandedPaths: [],
    maxLineY: 0,
    minLineY: 0,
    root: '/',
  })
})
