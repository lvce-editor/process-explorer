import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickAt } from '../src/parts/HandleClickAt/HandleClickAt.ts'
import { LeftClick } from '../src/parts/MouseEventType/MouseEventType.ts'

test.skip('handleClickAt - left click without shift', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a', path: '/a', selected: false, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: false, type: 0 },
    ],
  }
  const result = await handleClickAt(state, false, LeftClick, false, false, 0, 0)
  expect(result).toBeDefined()
})

test.skip('handleClickAt - shift click with no selection', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a', path: '/a', selected: false, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: false, type: 0 },
    ],
  }
  const result = await handleClickAt(state, false, LeftClick, false, true, 0, 0)
  expect(result).toBeDefined()
})

test('handleClickAt - shift click with existing selection', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a', path: '/a', selected: true, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: false, type: 0 },
      { depth: 1, name: 'c', path: '/c', selected: false, type: 0 },
    ],
  }
  const result = await handleClickAt(state, false, LeftClick, false, true, 0, 0)
  expect(result).toBeDefined()
})

test('handleClickAt - non left click', async () => {
  const state: ExplorerState = createDefaultState()
  const shiftKey = false
  const ctrlKey = false
  const result = await handleClickAt(state, false, 2, ctrlKey, shiftKey, 0, 0)
  expect(result).toBe(state)
})

test('handleClickAt - left click', async () => {
  const state: ExplorerState = createDefaultState()
  const shiftKey = false
  const ctrlKey = false
  const result = await handleClickAt(state, false, LeftClick, ctrlKey, shiftKey, 0, 0)
  expect(result).toBeDefined()
})

test.skip('handleClickAt - shift click with no selection', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a', path: '/a', selected: false, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: false, type: 0 },
    ],
  }
  const result = await handleClickAt(state, false, LeftClick, false, true, 0, 0)
  expect(result).toBeDefined()
})

test('handleClickAt - shift click with existing selection', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a', path: '/a', selected: true, type: 0 },
      { depth: 1, name: 'b', path: '/b', selected: false, type: 0 },
      { depth: 1, name: 'c', path: '/c', selected: false, type: 0 },
    ],
  }
  const result = await handleClickAt(state, false, LeftClick, false, true, 0, 0)
  expect(result).toBeDefined()
})
