import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { updateTree } from '../src/parts/UpdateTree/UpdateTree.ts'

test('updateTree - empty tree', () => {
  const tree = {}
  const path = '/test'
  const newDirents: readonly ExplorerItem[] = [
    { depth: 0, icon: '', name: 'file.txt', path: '/test/file.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File },
  ]
  const result = updateTree(tree, path, newDirents)
  expect(result).toEqual({
    '/test': newDirents,
  })
})

test('updateTree - existing tree', () => {
  const tree = {
    '/test': [{ depth: 0, icon: '', name: 'old.txt', path: '/test/old.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File }],
  }
  const path = '/test'
  const newDirents: readonly ExplorerItem[] = [
    { depth: 0, icon: '', name: 'new.txt', path: '/test/new.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File },
  ]
  const result = updateTree(tree, path, newDirents)
  expect(result).toEqual({
    '/test': newDirents,
  })
})

test('updateTree - nested path', () => {
  const tree = {
    '/test': [{ depth: 0, icon: '', name: 'folder', path: '/test/folder', posInSet: 1, selected: false, setSize: 1, type: DirentType.Directory }],
  }
  const path = '/test/folder'
  const newDirents: readonly ExplorerItem[] = [
    { depth: 0, icon: '', name: 'nested.txt', path: '/test/folder/nested.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File },
  ]
  const result = updateTree(tree, path, newDirents)
  expect(result).toEqual({
    '/test': tree['/test'],
    '/test/folder': newDirents,
  })
})
