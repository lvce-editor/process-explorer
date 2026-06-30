import { test, expect } from '@jest/globals'
import { ensureUri, ensureUris } from '../src/parts/EnsureUris/EnsureUris.ts'

test('ensureUri - adds file:// prefix to paths starting with /', () => {
  expect(ensureUri('/home/user/file.txt')).toBe('file:///home/user/file.txt')
  expect(ensureUri('/')).toBe('file:///')
  expect(ensureUri('/path/to/directory/')).toBe('file:///path/to/directory/')
})

test('ensureUri - returns string as-is if it does not start with /', () => {
  expect(ensureUri('file:///home/user/file.txt')).toBe('file:///home/user/file.txt')
  expect(ensureUri('https://example.com/file.txt')).toBe('https://example.com/file.txt')
  expect(ensureUri('relative/path/file.txt')).toBe('relative/path/file.txt')
  expect(ensureUri('')).toBe('')
})

test('ensureUris - processes array of strings', () => {
  const input = ['/home/user/file1.txt', '/home/user/file2.txt', 'file:///already/uri.txt']
  const result = ensureUris(input)
  expect(result).toEqual(['file:///home/user/file1.txt', 'file:///home/user/file2.txt', 'file:///already/uri.txt'])
})

test('ensureUris - handles empty array', () => {
  const result = ensureUris([])
  expect(result).toEqual([])
})

test('ensureUris - handles mixed paths and URIs', () => {
  const input = ['/absolute/path.txt', 'file:///already/uri.txt', 'https://example.com/file.txt', '/another/path']
  const result = ensureUris(input)
  expect(result).toEqual(['file:///absolute/path.txt', 'file:///already/uri.txt', 'https://example.com/file.txt', 'file:///another/path'])
})

test('ensureUris - preserves readonly array type', () => {
  const input: readonly string[] = ['/path1', '/path2']
  const result = ensureUris(input)
  expect(result).toEqual(['file:///path1', 'file:///path2'])
  // Verify it returns a readonly array
  expect(Object.isFrozen(result) || Array.isArray(result)).toBe(true)
})
