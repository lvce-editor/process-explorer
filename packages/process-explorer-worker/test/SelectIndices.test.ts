import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import { setSelectedIndices } from '../src/parts/SelectIndices/SelectIndices.js'

test('setSelectedIndices sets selection for given indices', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'file1', path: '/file1', selected: false, type: 0 },
      { depth: 0, name: 'file2', path: '/file2', selected: false, type: 0 },
      { depth: 0, name: 'file3', path: '/file3', selected: false, type: 0 },
    ],
  }

  const newState = setSelectedIndices(state, [0, 2])
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(false)
  expect(newState.items[2].selected).toBe(true)
})
