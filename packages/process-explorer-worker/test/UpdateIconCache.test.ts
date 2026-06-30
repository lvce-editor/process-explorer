import { test, expect } from '@jest/globals'
import type { FileIconCache } from '../src/parts/FileIconCache/FileIconCache.ts'
import type { IconRequest } from '../src/parts/IconRequest/IconRequest.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as UpdateIconCache from '../src/parts/UpdateIconCache/UpdateIconCache.ts'

test('updateIconCache - empty requests', () => {
  const cache: FileIconCache = {}
  const requests: readonly IconRequest[] = []
  const newIcons: readonly string[] = []
  expect(UpdateIconCache.updateIconCache(cache, requests, newIcons)).toBe(cache)
})

test('updateIconCache - new icons', () => {
  const cache: FileIconCache = {
    '/test/file1.txt': 'icon1',
  }
  const requests: readonly IconRequest[] = [{ name: 'file2.txt', path: '/test/file2.txt', type: DirentType.File }]
  const newIcons: readonly string[] = ['icon2']
  expect(UpdateIconCache.updateIconCache(cache, requests, newIcons)).toEqual({
    '/test/file1.txt': 'icon1',
    '/test/file2.txt': 'icon2',
  })
})

test('updateIconCache - immutability', () => {
  const cache: FileIconCache = { existing: 'icon' }
  const requests: readonly IconRequest[] = [{ name: 'file.txt', path: '/test/file.txt', type: DirentType.File }]
  const newIcons: readonly string[] = ['new-icon']
  const result = UpdateIconCache.updateIconCache(cache, requests, newIcons)
  expect(result).not.toBe(cache)
  expect(cache).toEqual({ existing: 'icon' })
})
