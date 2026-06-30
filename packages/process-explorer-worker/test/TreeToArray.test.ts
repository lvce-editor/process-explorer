import { expect, test } from '@jest/globals'
import type { Tree } from '../src/parts/Tree/Tree.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { treeToArray } from '../src/parts/TreeToArray/TreeToArray.ts'

test('treeToArray - empty tree', () => {
  const map: Tree = {}
  const root = '/test'
  expect(treeToArray(map, root)).toEqual([])
})

test('treeToArray - single file', () => {
  const map: Tree = {
    '': [{ name: 'file.txt', type: DirentType.File }],
  }
  const root = '/test'
  const result = treeToArray(map, root)
  expect(result).toEqual([
    {
      depth: 1,
      icon: '',
      name: 'file.txt',
      path: '/test/file.txt',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: 7,
    },
  ])
})

test('treeToArray - nested structure', () => {
  const map: Tree = {
    '': [
      { name: 'folder', type: DirentType.Directory },
      { name: 'file.txt', type: DirentType.File },
    ],
    '/folder': [{ name: 'nested.txt', type: DirentType.File }],
  }
  const root = '/test'
  const result = treeToArray(map, root)
  expect(result).toEqual([
    {
      depth: 1,
      icon: '',
      name: 'folder',
      path: '/test/folder',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: 3,
    },
    {
      depth: 2,
      icon: '',
      name: 'nested.txt',
      path: '/test/folder/nested.txt',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: 7,
    },
    {
      depth: 1,
      icon: '',
      name: 'file.txt',
      path: '/test/file.txt',
      posInSet: 2,
      selected: false,
      setSize: 2,
      type: 7,
    },
  ])
})

test('treeToArray - deep nested structure', () => {
  const map: Tree = {
    '': [{ name: 'folder1', type: DirentType.Directory }],
    '/folder1': [{ name: 'folder2', type: DirentType.Directory }],
    '/folder1/folder2': [{ name: 'deep.txt', type: DirentType.File }],
  }
  const root = '/test'
  const result = treeToArray(map, root)
  expect(result).toEqual([
    {
      depth: 1,
      icon: '',
      name: 'folder1',
      path: '/test/folder1',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: 3,
    },
    {
      depth: 2,
      icon: '',
      name: 'folder2',
      path: '/test/folder1/folder2',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: 3,
    },
    {
      depth: 3,
      icon: '',
      name: 'deep.txt',
      path: '/test/folder1/folder2/deep.txt',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: 7,
    },
  ])
})

test('treeToArray - update tree and children', () => {
  const map: Tree = {
    '': [
      { name: 'folder1', type: DirentType.Directory },
      { name: 'folder2', type: DirentType.Directory },
    ],
    '/folder1': [
      { name: 'subfolder', type: DirentType.Directory },
      { name: 'file1.txt', type: DirentType.File },
    ],
    '/folder1/subfolder': [{ name: 'deep.txt', type: DirentType.File }],
    '/folder2': [{ name: 'file2.txt', type: DirentType.File }],
  }
  const root = '/test'
  const result = treeToArray(map, root)
  expect(result).toEqual([
    {
      depth: 1,
      icon: '',
      name: 'folder1',
      path: '/test/folder1',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: 3,
    },
    {
      depth: 2,
      icon: '',
      name: 'subfolder',
      path: '/test/folder1/subfolder',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: 3,
    },
    {
      depth: 3,
      icon: '',
      name: 'deep.txt',
      path: '/test/folder1/subfolder/deep.txt',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: 7,
    },
    {
      depth: 2,
      icon: '',
      name: 'file1.txt',
      path: '/test/folder1/file1.txt',
      posInSet: 2,
      selected: false,
      setSize: 2,
      type: 7,
    },
    {
      depth: 1,
      icon: '',
      name: 'folder2',
      path: '/test/folder2',
      posInSet: 2,
      selected: false,
      setSize: 2,
      type: 3,
    },
    {
      depth: 2,
      icon: '',
      name: 'file2.txt',
      path: '/test/folder2/file2.txt',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: 7,
    },
  ])
})
