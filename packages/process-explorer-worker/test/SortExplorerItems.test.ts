import { test, expect } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { sortExplorerItems } from '../src/parts/SortExplorerItems/SortExplorerItems.ts'

const createItem = (name: string, type: number): any => ({
  depth: 1,
  name,
  path: `/test/${name}`,
  selected: false,
  type,
})

test('sorts folders before files', () => {
  const items = [
    createItem('file1', DirentType.File),
    createItem('folder1', DirentType.Directory),
    createItem('file2', DirentType.File),
    createItem('folder2', DirentType.Directory),
  ]
  const sorted = sortExplorerItems(items)
  expect(sorted[0].type).toBe(DirentType.Directory)
  expect(sorted[1].type).toBe(DirentType.Directory)
  expect(sorted[2].type).toBe(DirentType.File)
  expect(sorted[3].type).toBe(DirentType.File)
})

test('sorts items alphabetically within same type', () => {
  const items = [
    createItem('b', DirentType.Directory),
    createItem('a', DirentType.Directory),
    createItem('d', DirentType.File),
    createItem('c', DirentType.File),
  ]
  const sorted = sortExplorerItems(items)
  expect(sorted[0].name).toBe('a')
  expect(sorted[1].name).toBe('b')
  expect(sorted[2].name).toBe('c')
  expect(sorted[3].name).toBe('d')
})

test('sorts numeric names correctly', () => {
  const items = [createItem('10', DirentType.Directory), createItem('2', DirentType.Directory), createItem('1', DirentType.Directory)]
  const sorted = sortExplorerItems(items)
  expect(sorted[0].name).toBe('1')
  expect(sorted[1].name).toBe('2')
  expect(sorted[2].name).toBe('10')
})

test('sorts names with leading numbers and text consistently', () => {
  const items = [createItem('10file.txt', DirentType.File), createItem('1file.txt', DirentType.File)]
  const sorted = sortExplorerItems(items)
  expect(sorted[0].name).toBe('1file.txt')
  expect(sorted[1].name).toBe('10file.txt')
})

test('handles mixed types and names', () => {
  const items = [
    createItem('file2', DirentType.File),
    createItem('folder1', DirentType.Directory),
    createItem('file1', DirentType.File),
    createItem('folder2', DirentType.Directory),
  ]
  const sorted = sortExplorerItems(items)
  expect(sorted[0].name).toBe('folder1')
  expect(sorted[1].name).toBe('folder2')
  expect(sorted[2].name).toBe('file1')
  expect(sorted[3].name).toBe('file2')
})
