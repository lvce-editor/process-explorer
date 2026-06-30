import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { FileIconCache } from '../src/parts/FileIconCache/FileIconCache.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as GetMissingIconRequests from '../src/parts/GetMissingIconRequests/GetMissingIconRequests.ts'

test('getMissingIconRequests - empty list', () => {
  const dirents: readonly ExplorerItem[] = []
  const cache: FileIconCache = {}
  expect(GetMissingIconRequests.getMissingIconRequests(dirents, cache)).toEqual([])
})

test('getMissingIconRequests - all in cache', () => {
  const dirents: readonly ExplorerItem[] = [{ depth: 0, name: 'file.txt', path: '/test/file.txt', selected: false, type: DirentType.File }]
  const cache: FileIconCache = {
    '/test/file.txt': 'icon',
  }
  expect(GetMissingIconRequests.getMissingIconRequests(dirents, cache)).toEqual([])
})

test('getMissingIconRequests - some missing', () => {
  const dirents: readonly ExplorerItem[] = [
    { depth: 0, name: 'file1.txt', path: '/test/file1.txt', selected: false, type: DirentType.File },
    { depth: 0, name: 'file2.txt', path: '/test/file2.txt', selected: false, type: DirentType.File },
  ]
  const cache: FileIconCache = {
    '/test/file1.txt': 'icon',
  }
  expect(GetMissingIconRequests.getMissingIconRequests(dirents, cache)).toEqual([
    { name: 'file2.txt', path: '/test/file2.txt', type: DirentType.File },
  ])
})
