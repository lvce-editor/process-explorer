import { test, expect } from '@jest/globals'
import { Directory, DirectoryExpanded, DirectoryExpanding, File } from '../src/parts/DirentType/DirentType.ts'
import { isExpanded } from '../src/parts/IsExpanded/IsExpanded.ts'

test('isExpanded - DirectoryExpanded', () => {
  const item = { depth: 0, name: 'test', path: '/test', selected: false, type: DirectoryExpanded }
  expect(isExpanded(item)).toBe(true)
})

test('isExpanded - DirectoryExpanding', () => {
  const item = { depth: 0, name: 'test', path: '/test', selected: false, type: DirectoryExpanding }
  expect(isExpanded(item)).toBe(true)
})

test('isExpanded - Directory', () => {
  const item = { depth: 0, name: 'test', path: '/test', selected: false, type: Directory }
  expect(isExpanded(item)).toBe(false)
})

test('isExpanded - File', () => {
  const item = { depth: 0, name: 'test', path: '/test', selected: false, type: File }
  expect(isExpanded(item)).toBe(false)
})
