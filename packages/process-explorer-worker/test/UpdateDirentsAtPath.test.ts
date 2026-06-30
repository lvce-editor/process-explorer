import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { updateDirentsAtPath } from '../src/parts/UpdateDirentsAtPath/UpdateDirentsAtPath.ts'

test('updateDirentsAtPath - replaces root children', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 1, icon: '', name: 'old.txt', path: '/workspace/old.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File },
  ]
  const result = updateDirentsAtPath(items, '/workspace', '/workspace', [
    { name: 'b.txt', type: DirentType.File },
    { name: 'src', type: DirentType.Directory },
  ])
  expect(result).toEqual([
    { depth: 1, icon: '', name: 'src', path: '/workspace/src', posInSet: 1, selected: false, setSize: 2, type: DirentType.Directory },
    { depth: 1, icon: '', name: 'b.txt', path: '/workspace/b.txt', posInSet: 2, selected: false, setSize: 2, type: DirentType.File },
  ])
})

test('updateDirentsAtPath - replaces nested children', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 1, icon: '', name: 'src', path: '/workspace/src', posInSet: 1, selected: false, setSize: 1, type: DirentType.DirectoryExpanded },
    { depth: 2, icon: '', name: 'old.ts', path: '/workspace/src/old.ts', posInSet: 1, selected: false, setSize: 1, type: DirentType.File },
  ]
  const result = updateDirentsAtPath(items, '/workspace/src', '/workspace', [{ name: 'index.ts', type: DirentType.File }])
  expect(result).toEqual([
    { depth: 1, icon: '', name: 'src', path: '/workspace/src', posInSet: 1, selected: false, setSize: 1, type: DirentType.DirectoryExpanded },
    { depth: 2, icon: '', name: 'index.ts', path: '/workspace/src/index.ts', posInSet: 1, selected: false, setSize: 1, type: DirentType.File },
  ])
})

test.skip('updateDirentsAtPath - empty items', () => {
  const items: readonly ExplorerItem[] = []
  const path = '/test'
  const root = '/test'
  const newDirents = [{ name: 'file.txt', type: DirentType.File }]
  const result = updateDirentsAtPath(items, path, root, newDirents)
  expect(result).toHaveLength(1)
  expect(result[0].name).toBe('file.txt')
  expect(result[0].type).toBe(DirentType.File)
  expect(result[0].path).toBe('/test/file.txt')
  expect(result[0].depth).toBe(0)
  expect(result[0].posInSet).toBe(1)
  expect(result[0].setSize).toBe(1)
})

test.skip('updateDirentsAtPath - update existing items', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, icon: '', name: 'folder', path: '/test/folder', posInSet: 1, selected: false, setSize: 2, type: DirentType.Directory },
    { depth: 0, icon: '', name: 'file.txt', path: '/test/file.txt', posInSet: 2, selected: false, setSize: 2, type: DirentType.File },
  ]
  const path = '/test'
  const root = '/test'
  const newDirents = [
    { name: 'new.txt', type: DirentType.File },
    { name: 'folder', type: DirentType.Directory },
  ]
  const result = updateDirentsAtPath(items, path, root, newDirents)
  expect(result).toHaveLength(2)
  expect(result[0].name).toBe('folder')
  expect(result[0].type).toBe(DirentType.Directory)
  expect(result[0].path).toBe('/test/folder')
  expect(result[0].depth).toBe(0)
  expect(result[0].posInSet).toBe(1)
  expect(result[0].setSize).toBe(2)
  expect(result[1].name).toBe('new.txt')
  expect(result[1].type).toBe(DirentType.File)
  expect(result[1].path).toBe('/test/new.txt')
  expect(result[1].depth).toBe(0)
  expect(result[1].posInSet).toBe(2)
  expect(result[1].setSize).toBe(2)
})

test.skip('updateDirentsAtPath - nested structure', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, icon: '', name: 'folder', path: '/test/folder', posInSet: 1, selected: false, setSize: 1, type: DirentType.Directory },
    { depth: 1, icon: '', name: 'nested.txt', path: '/test/folder/nested.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File },
  ]
  const path = '/test/folder'
  const root = '/test'
  const newDirents = [{ name: 'new.txt', type: DirentType.File }]
  const result = updateDirentsAtPath(items, path, root, newDirents)
  expect(result).toHaveLength(2)
  expect(result[0].name).toBe('folder')
  expect(result[0].type).toBe(DirentType.Directory)
  expect(result[0].path).toBe('/test/folder')
  expect(result[0].depth).toBe(0)
  expect(result[0].posInSet).toBe(1)
  expect(result[0].setSize).toBe(1)
  expect(result[1].name).toBe('new.txt')
  expect(result[1].type).toBe(DirentType.File)
  expect(result[1].path).toBe('/test/folder/new.txt')
  expect(result[1].depth).toBe(1)
  expect(result[1].posInSet).toBe(1)
  expect(result[1].setSize).toBe(1)
})
