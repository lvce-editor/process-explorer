import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as IsExpandedDirectory from '../src/parts/IsExpandedDirectory/IsExpandedDirectory.ts'

test('isExpandedDirectory - expanded directory', () => {
  const item: ExplorerItem = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.DirectoryExpanded,
  }
  expect(IsExpandedDirectory.isExpandedDirectory(item)).toBe(true)
})

test('isExpandedDirectory - collapsed directory', () => {
  const item: ExplorerItem = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.Directory,
  }
  expect(IsExpandedDirectory.isExpandedDirectory(item)).toBe(false)
})

test('isExpandedDirectory - expanding directory', () => {
  const item: ExplorerItem = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.DirectoryExpanding,
  }
  expect(IsExpandedDirectory.isExpandedDirectory(item)).toBe(false)
})

test('isExpandedDirectory - file', () => {
  const item: ExplorerItem = {
    depth: 0,
    name: 'test.txt',
    path: '/test.txt',
    selected: false,
    type: DirentType.File,
  }
  expect(IsExpandedDirectory.isExpandedDirectory(item)).toBe(false)
})
