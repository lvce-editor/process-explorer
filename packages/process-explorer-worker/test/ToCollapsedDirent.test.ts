import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { toCollapsedDirent } from '../src/parts/ToCollapsedDirent/ToCollapsedDirent.ts'

test('should collapse expanded directory to regular directory', () => {
  const expandedDir: ExplorerItem = {
    depth: 1,
    name: 'test-dir',
    path: '/test/test-dir',
    selected: false,
    type: DirentType.DirectoryExpanded,
  }

  const result = toCollapsedDirent(expandedDir)

  expect(result).toEqual({
    depth: 1,
    name: 'test-dir',
    path: '/test/test-dir',
    selected: false,
    type: DirentType.Directory,
  })
})

test('should return unchanged item for non-expanded directory', () => {
  const regularDir: ExplorerItem = {
    depth: 1,
    name: 'test-dir',
    path: '/test/test-dir',
    selected: false,
    type: DirentType.Directory,
  }

  const result = toCollapsedDirent(regularDir)

  expect(result).toBe(regularDir)
})

test('should return unchanged item for file', () => {
  const file: ExplorerItem = {
    depth: 1,
    name: 'test-file.txt',
    path: '/test/test-file.txt',
    selected: false,
    type: DirentType.File,
  }

  const result = toCollapsedDirent(file)

  expect(result).toBe(file)
})

test('should return unchanged item for symlink', () => {
  const symlink: ExplorerItem = {
    depth: 1,
    name: 'test-symlink',
    path: '/test/test-symlink',
    selected: false,
    type: DirentType.Symlink,
  }

  const result = toCollapsedDirent(symlink)

  expect(result).toBe(symlink)
})

test('should preserve all properties when collapsing expanded directory', () => {
  const expandedDir: ExplorerItem = {
    depth: 2,
    icon: 'folder-icon',
    name: 'test-dir',
    path: '/test/test-dir',
    posInSet: 3,
    selected: true,
    setSize: 5,
    type: DirentType.DirectoryExpanded,
  }

  const result = toCollapsedDirent(expandedDir)

  expect(result).toEqual({
    depth: 2,
    icon: 'folder-icon',
    name: 'test-dir',
    path: '/test/test-dir',
    posInSet: 3,
    selected: true,
    setSize: 5,
    type: DirentType.Directory,
  })
})
