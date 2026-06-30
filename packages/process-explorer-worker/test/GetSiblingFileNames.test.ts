import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as GetSiblingFileNames from '../src/parts/GetSiblingFileNames/GetSiblingFileNames.ts'

test('getSiblingFileNames - root level files', () => {
  const items: readonly ExplorerItem[] = [
    {
      depth: 0,
      icon: '',
      name: 'file1.txt',
      path: '/root/file1.txt',
      posInSet: 0,
      selected: false,
      setSize: 2,
      type: 1,
    },
    {
      depth: 0,
      icon: '',
      name: 'file2.txt',
      path: '/root/file2.txt',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: 1,
    },
    {
      depth: 1,
      icon: '',
      name: 'file3.txt',
      path: '/root/folder/file3.txt',
      posInSet: 0,
      selected: false,
      setSize: 1,
      type: 1,
    },
  ]

  const result = GetSiblingFileNames.getSiblingFileNames(items, 0, '/root', '/')
  expect(result).toEqual(['file1.txt', 'file2.txt'])
})

test('getSiblingFileNames - folder level files', () => {
  const items: readonly ExplorerItem[] = [
    {
      depth: 0,
      icon: '',
      name: 'file1.txt',
      path: '/root/file1.txt',
      posInSet: 0,
      selected: false,
      setSize: 1,
      type: 1,
    },
    {
      depth: 1,
      icon: '',
      name: 'file2.txt',
      path: '/root/folder/file2.txt',
      posInSet: 0,
      selected: false,
      setSize: 2,
      type: 1,
    },
    {
      depth: 1,
      icon: '',
      name: 'file3.txt',
      path: '/root/folder/file3.txt',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: 1,
    },
  ]

  const result = GetSiblingFileNames.getSiblingFileNames(items, 1, '/root', '/')
  expect(result).toEqual(['file2.txt', 'file3.txt'])
})

test('getSiblingFileNames - no siblings', () => {
  const items: readonly ExplorerItem[] = [
    {
      depth: 0,
      icon: '',
      name: 'file1.txt',
      path: '/root/file1.txt',
      posInSet: 0,
      selected: false,
      setSize: 1,
      type: 1,
    },
  ]

  const result = GetSiblingFileNames.getSiblingFileNames(items, 0, '/root', '/')
  expect(result).toEqual(['file1.txt'])
})
