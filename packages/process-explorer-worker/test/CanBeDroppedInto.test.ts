import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as CanBeDroppedInto from '../src/parts/CanBeDroppedInto/CanBeDroppedInto.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('canBeDroppedInto - directory', () => {
  const item: ExplorerItem = {
    depth: 0,
    name: 'directory',
    path: '/directory',
    selected: false,
    type: DirentType.Directory,
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(true)
})

test('canBeDroppedInto - directory expanded', () => {
  const item: ExplorerItem = {
    depth: 0,
    name: 'directory',
    path: '/directory',
    selected: false,
    type: DirentType.DirectoryExpanded,
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(true)
})

test('canBeDroppedInto - directory expanding', () => {
  const item: ExplorerItem = {
    depth: 0,
    name: 'directory',
    path: '/directory',
    selected: false,
    type: DirentType.DirectoryExpanding,
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(true)
})

test('canBeDroppedInto - file', () => {
  const item: ExplorerItem = {
    depth: 0,
    name: 'file.txt',
    path: '/file.txt',
    selected: false,
    type: DirentType.File,
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(false)
})

test('canBeDroppedInto - unknown type', () => {
  const item: ExplorerItem = {
    depth: 0,
    name: 'unknown',
    path: '/unknown',
    selected: false,
    type: 999_999,
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(false)
})
