import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { selectForCompare } from '../src/parts/SelectForCompare/SelectForCompare.ts'

test('selectForCompare - stores focused file uri', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'a.txt', path: '/a.txt', selected: false, type: DirentType.File }],
  }

  const result = selectForCompare(state)

  expect(result).toEqual({
    ...state,
    compareSourceUri: '/a.txt',
  })
})

test('selectForCompare - ignores non-file focus', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'folder', path: '/folder', selected: false, type: DirentType.Directory }],
  }

  const result = selectForCompare(state)

  expect(result).toBe(state)
})
