import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { selectAll } from '../src/parts/SelectAll/SelectAll.ts'

const createItem = (name: string, selected: boolean): ExplorerItem => ({
  depth: 0,
  name,
  path: `/${name}`,
  selected,
  type: 0,
})

test('selectAll', () => {
  const state = createDefaultState()
  const items = [createItem('file1', false), createItem('file2', false), createItem('file3', false)]
  const newState = selectAll({
    ...state,
    items,
  })
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(true)
})
