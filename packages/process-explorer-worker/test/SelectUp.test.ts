import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { selectUp } from '../src/parts/SelectUp/SelectUp.ts'

test('selectUp - first item', () => {
  const state = createDefaultState()
  const newState = selectUp(state)
  expect(newState).toBe(state)
})

test('selectUp - second item', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 1,
    items: [
      { depth: 1, name: 'a', path: '/a', selected: false, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: false, type: 0 },
    ],
  }
  const newState = selectUp(state)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(false)
})

test.skip('selectUp - multiple items with selection', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 2,
    items: [
      { depth: 1, name: 'a', path: '/a', selected: false, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: true, type: 0 },
      { depth: 1, name: 'c', path: '/c', selected: false, type: 0 },
    ],
  }
  const newState = selectUp(state)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(false)
})

test('selectUp - multiple items with selection at top', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 1,
    items: [
      { depth: 1, name: 'a', path: '/a', selected: true, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: false, type: 0 },
      { depth: 1, name: 'c', path: '/c', selected: false, type: 0 },
    ],
  }
  const newState = selectUp(state)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(false)
  expect(newState.items[2].selected).toBe(false)
})

test.skip('selectUp - multiple items with multiple selections', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 2,
    items: [
      { depth: 1, name: 'a', path: '/a', selected: true, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: true, type: 0 },
      { depth: 1, name: 'c', path: '/c', selected: false, type: 0 },
    ],
  }
  const newState = selectUp(state)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(false)
})
