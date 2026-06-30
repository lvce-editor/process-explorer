import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleKeyDown } from '../src/parts/HandleKeyDown/HandleKeyDown.ts'

test.skip('handleKeyDown - empty state', () => {
  const state = createDefaultState()
  const newState = handleKeyDown(state, 'a')
  expect(newState.focusWord).toBe('a')
  expect(newState.focusedIndex).toBe(0)
})

test.skip('handleKeyDown - with items', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'apple', path: '/apple', selected: false, type: 0 },
      { depth: 0, name: 'banana', path: '/banana', selected: false, type: 0 },
      { depth: 0, name: 'cherry', path: '/cherry', selected: false, type: 0 },
    ],
  }
  const newState = handleKeyDown(state, 'b')
  expect(newState.focusWord).toBe('b')
  expect(newState.focusedIndex).toBe(1)
})

test.skip('handleKeyDown - no match', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'apple', path: '/apple', selected: false, type: 0 },
      { depth: 0, name: 'banana', path: '/banana', selected: false, type: 0 },
      { depth: 0, name: 'cherry', path: '/cherry', selected: false, type: 0 },
    ],
  }
  const newState = handleKeyDown(state, 'x')
  expect(newState.focusWord).toBe('x')
  expect(newState.focusedIndex).toBe(0)
})

test.skip('handleKeyDown - multiple characters', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'apple', path: '/apple', selected: false, type: 0 },
      { depth: 0, name: 'banana', path: '/banana', selected: false, type: 0 },
      { depth: 0, name: 'cherry', path: '/cherry', selected: false, type: 0 },
    ],
  }
  let newState = handleKeyDown(state, 'b')
  newState = handleKeyDown(newState, 'a')
  expect(newState.focusWord).toBe('ba')
  expect(newState.focusedIndex).toBe(1)
})
