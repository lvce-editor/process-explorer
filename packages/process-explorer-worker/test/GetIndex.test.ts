import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { getIndex } from '../src/parts/GetIndex/GetIndex.ts'

test('getIndex - finds item', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, name: 'a', path: '/a', selected: false, type: 1 },
    { depth: 0, name: 'b', path: '/b', selected: true, type: 2 },
    { depth: 0, name: 'c', path: '/c', selected: false, type: 1 },
  ]
  expect(getIndex(items, '/b')).toBe(1)
})

test('getIndex - item not found', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, name: 'a', path: '/a', selected: false, type: 1 },
    { depth: 0, name: 'b', path: '/b', selected: false, type: 2 },
  ]
  expect(getIndex(items, '/not-found')).toBe(-1)
})

test('getIndex - empty array', () => {
  const items: readonly ExplorerItem[] = []
  expect(getIndex(items, '/any')).toBe(-1)
})
