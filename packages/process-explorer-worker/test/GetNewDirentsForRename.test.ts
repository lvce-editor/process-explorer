import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getNewDirentsForRename } from '../src/parts/GetNewDirentsForRename/GetNewDirentsForRename.ts'

test('getNewDirentsForRename - file', () => {
  const items = [
    {
      depth: 0,
      name: 'test.txt',
      path: '/test.txt',
      selected: false,
      type: DirentType.File,
    },
  ]
  const result = getNewDirentsForRename(items, 0)
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    depth: 0,
    name: 'test.txt',
    path: '/test.txt',
    selected: false,
    type: DirentType.EditingFile,
  })
})

test('getNewDirentsForRename - folder', () => {
  const items = [
    {
      depth: 0,
      name: 'test',
      path: '/test',
      selected: false,
      type: DirentType.Directory,
    },
  ]
  const result = getNewDirentsForRename(items, 0)
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.EditingFolder,
  })
})
