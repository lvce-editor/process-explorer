import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { Directory, DirectoryExpanded, File } from '../src/parts/DirentType/DirentType.ts'
import { getExpandedDirents } from '../src/parts/GetExpandedDirents/GetExpandedDirents.ts'

test('getExpandedDirents - empty array', () => {
  const items: readonly ExplorerItem[] = []
  expect(getExpandedDirents(items)).toHaveLength(0)
})

test('getExpandedDirents - no expanded items', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, name: 'folder1', path: '/folder1', selected: false, type: Directory },
    { depth: 0, name: 'file1.txt', path: '/file1.txt', selected: false, type: File },
  ]
  expect(getExpandedDirents(items)).toHaveLength(0)
})

test('getExpandedDirents - with expanded items', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, name: 'folder1', path: '/folder1', selected: false, type: DirectoryExpanded },
    { depth: 0, name: 'file1.txt', path: '/file1.txt', selected: false, type: File },
  ]
  const result = getExpandedDirents(items)
  expect(result).toHaveLength(1)
  expect(result[0].name).toBe('folder1')
})
