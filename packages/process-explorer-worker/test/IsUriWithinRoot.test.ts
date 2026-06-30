import { test, expect } from '@jest/globals'
import { isUriWithinRoot } from '../src/parts/IsUriWithinRoot/IsUriWithinRoot.ts'

test('isUriWithinRoot returns true for exact root match', () => {
  expect(isUriWithinRoot('/root', '/root', '/')).toBe(true)
})

test('isUriWithinRoot returns true for child uri', () => {
  expect(isUriWithinRoot('/root', '/root/folder/file.txt', '/')).toBe(true)
})

test('isUriWithinRoot returns false for uri outside root', () => {
  expect(isUriWithinRoot('/root', '/other/file.txt', '/')).toBe(false)
})

test('isUriWithinRoot returns false for matching prefix without separator', () => {
  expect(isUriWithinRoot('/root', '/rooted/file.txt', '/')).toBe(false)
})

test('isUriWithinRoot supports roots that already end with the path separator', () => {
  expect(isUriWithinRoot('/root/', '/root/folder/file.txt', '/')).toBe(true)
})
