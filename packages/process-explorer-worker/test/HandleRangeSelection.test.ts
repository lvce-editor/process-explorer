import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleRangeSelection } from '../src/parts/HandleRangeSelection/HandleRangeSelection.ts'

const createItem = (name: string, selected: boolean): ExplorerItem => ({
  depth: 0,
  name,
  path: `/${name}`,
  selected,
  type: 0,
})

test('handleRangeSelection - forward range', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a', path: '/a', selected: false, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: false, type: 0 },
      { depth: 1, name: 'c', path: '/c', selected: false, type: 0 },
    ],
  }
  const newState = handleRangeSelection(state, 0, 2)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(true)
})

test('handleRangeSelection - backward range', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a', path: '/a', selected: false, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: false, type: 0 },
      { depth: 1, name: 'c', path: '/c', selected: false, type: 0 },
    ],
  }
  expect(() => handleRangeSelection(state, 2, 0)).toThrow(new Error('startIndex must be less than or equal to endIndex'))
})

test('handleRangeSelection - preserve existing selections', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a', path: '/a', selected: true, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: false, type: 0 },
      { depth: 1, name: 'c', path: '/c', selected: true, type: 0 },
    ],
  }
  const newState = handleRangeSelection(state, 0, 2)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(true)
})

test('selects items in range', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [createItem('a', false), createItem('b', false), createItem('c', false), createItem('d', false)],
  }

  const newState = handleRangeSelection(state, 1, 2)

  expect(newState.items).toEqual([createItem('a', false), createItem('b', true), createItem('c', true), createItem('d', false)])
})

test('throws error when startIndex > endIndex', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [createItem('a', false), createItem('b', false)],
  }

  expect(() => handleRangeSelection(state, 1, 0)).toThrow('startIndex must be less than or equal to endIndex')
})
