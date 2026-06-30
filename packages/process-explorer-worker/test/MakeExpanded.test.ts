import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { makeExpanded } from '../src/parts/MakeExpanded/MakeExpanded.ts'

test('makeExpanded - directory', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.Directory,
  }
  const result = makeExpanded(dirent)
  expect(result).toEqual({
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.DirectoryExpanded,
  })
})

test('makeExpanded - file', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test.txt',
    path: '/test.txt',
    selected: false,
    type: DirentType.File,
  }
  const result = makeExpanded(dirent)
  expect(result).toEqual(dirent)
})
