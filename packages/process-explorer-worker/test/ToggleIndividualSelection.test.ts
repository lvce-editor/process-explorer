import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import { toggleIndividualSelection } from '../src/parts/ToggleIndividualSelection/ToggleIndividualSelection.js'

test('toggleIndividualSelection - toggles selection of item at valid index', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'file1', path: '/file1', selected: false, type: 0 },
      { depth: 0, name: 'file2', path: '/file2', selected: false, type: 0 },
      { depth: 0, name: 'file3', path: '/file3', selected: false, type: 0 },
    ],
  }

  const newState = await toggleIndividualSelection(state, 1)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[2].selected).toBe(false)
})

test('toggleIndividualSelection - toggles selection from true to false', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'file1', path: '/file1', selected: false, type: 0 },
      { depth: 0, name: 'file2', path: '/file2', selected: true, type: 0 },
      { depth: 0, name: 'file3', path: '/file3', selected: false, type: 0 },
    ],
  }

  const newState = await toggleIndividualSelection(state, 1)
  expect(newState.items[1].selected).toBe(false)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[2].selected).toBe(false)
})

test('toggleIndividualSelection - does nothing when index is negative', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'file1', path: '/file1', selected: false, type: 0 },
      { depth: 0, name: 'file2', path: '/file2', selected: false, type: 0 },
    ],
  }

  const newState = await toggleIndividualSelection(state, -1)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(false)
})

test('toggleIndividualSelection - does nothing when index is out of range', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'file1', path: '/file1', selected: false, type: 0 },
      { depth: 0, name: 'file2', path: '/file2', selected: false, type: 0 },
    ],
  }

  const newState = await toggleIndividualSelection(state, 2)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(false)
})

test('toggleIndividualSelection - preserves other selections', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'file1', path: '/file1', selected: true, type: 0 },
      { depth: 0, name: 'file2', path: '/file2', selected: false, type: 0 },
      { depth: 0, name: 'file3', path: '/file3', selected: true, type: 0 },
    ],
  }

  const newState = await toggleIndividualSelection(state, 1)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(true)
})
