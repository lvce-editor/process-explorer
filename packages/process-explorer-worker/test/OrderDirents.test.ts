import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { orderDirents } from '../src/parts/OrderDirents/OrderDirents.ts'

test('empty array returns empty array', () => {
  expect(orderDirents([])).toEqual([])
})

test('orders single top level item', () => {
  const input: readonly ExplorerItem[] = [{ depth: 1, name: 'file1', path: '/file1', selected: false, type: 1 }]
  expect(orderDirents(input)).toEqual(input)
})

test('orders multiple top level items', () => {
  const input: readonly ExplorerItem[] = [
    { depth: 1, name: 'file2', path: '/file2', selected: false, type: 1 },
    { depth: 1, name: 'file1', path: '/file1', selected: false, type: 1 },
  ]
  const expected = [
    { depth: 1, name: 'file2', path: '/file2', selected: false, type: 1 },
    { depth: 1, name: 'file1', path: '/file1', selected: false, type: 1 },
  ]
  expect(orderDirents(input)).toEqual(expected)
})

test('orders nested items correctly', () => {
  const input: readonly ExplorerItem[] = [
    { depth: 2, name: 'file1', path: '/folder1/file1', selected: false, type: 1 },
    { depth: 1, name: 'folder1', path: '/folder1', selected: false, type: 2 },
    { depth: 2, name: 'file2', path: '/folder2/file2', selected: false, type: 1 },
    { depth: 1, name: 'folder2', path: '/folder2', selected: false, type: 2 },
  ]
  const expected = [
    { depth: 1, name: 'folder1', path: '/folder1', selected: false, type: 2 },
    { depth: 2, name: 'file1', path: '/folder1/file1', selected: false, type: 1 },
    { depth: 1, name: 'folder2', path: '/folder2', selected: false, type: 2 },
    { depth: 2, name: 'file2', path: '/folder2/file2', selected: false, type: 1 },
  ]
  expect(orderDirents(input)).toEqual(expected)
})

test('orders deeply nested items correctly', () => {
  const input: readonly ExplorerItem[] = [
    { depth: 3, name: 'file1', path: '/folder1/subfolder/file1', selected: false, type: 1 },
    { depth: 2, name: 'subfolder', path: '/folder1/subfolder', selected: false, type: 2 },
    { depth: 1, name: 'folder1', path: '/folder1', selected: false, type: 2 },
    { depth: 1, name: 'folder2', path: '/folder2', selected: false, type: 2 },
  ]
  const expected = [
    { depth: 1, name: 'folder1', path: '/folder1', selected: false, type: 2 },
    { depth: 2, name: 'subfolder', path: '/folder1/subfolder', selected: false, type: 2 },
    { depth: 3, name: 'file1', path: '/folder1/subfolder/file1', selected: false, type: 1 },
    { depth: 1, name: 'folder2', path: '/folder2', selected: false, type: 2 },
  ]
  expect(orderDirents(input)).toEqual(expected)
})

test('orders subtree whose root is deeper than top level', () => {
  const input: readonly ExplorerItem[] = [
    { depth: 3, name: 'file1', path: '/folder1/subfolder/file1', selected: false, type: 1 },
    { depth: 2, name: 'subfolder', path: '/folder1/subfolder', selected: false, type: 2 },
  ]
  const expected = [
    { depth: 2, name: 'subfolder', path: '/folder1/subfolder', selected: false, type: 2 },
    { depth: 3, name: 'file1', path: '/folder1/subfolder/file1', selected: false, type: 1 },
  ]
  expect(orderDirents(input)).toEqual(expected)
})
