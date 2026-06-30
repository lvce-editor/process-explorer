import { test, expect } from '@jest/globals'
import { createDecorationMap } from '../src/parts/CreateDecorationMap/CreateDecorationMap.ts'

test('createDecorationMap - creates map from single decoration', () => {
  const decorations = [{ decoration: 'modified', uri: '/home/user/file.txt' }]
  const result = createDecorationMap(decorations)
  expect(result).toEqual({
    'file:///home/user/file.txt': 'modified',
  })
})

test('createDecorationMap - creates map from multiple decorations', () => {
  const decorations = [
    { decoration: 'modified', uri: '/home/user/file1.txt' },
    { decoration: 'added', uri: '/home/user/file2.txt' },
    { decoration: 'deleted', uri: '/home/user/file3.txt' },
  ]
  const result = createDecorationMap(decorations)
  expect(result).toEqual({
    'file:///home/user/file1.txt': 'modified',
    'file:///home/user/file2.txt': 'added',
    'file:///home/user/file3.txt': 'deleted',
  })
})

test('createDecorationMap - handles URIs that are already URIs', () => {
  const decorations = [
    { decoration: 'modified', uri: 'file:///home/user/file1.txt' },
    { decoration: 'added', uri: 'https://example.com/file.txt' },
  ]
  const result = createDecorationMap(decorations)
  expect(result).toEqual({
    'file:///home/user/file1.txt': 'modified',
    'https://example.com/file.txt': 'added',
  })
})

test('createDecorationMap - handles empty array', () => {
  const decorations: readonly any[] = []
  const result = createDecorationMap(decorations)
  expect(Object.keys(result)).toHaveLength(0)
  expect(Object.getPrototypeOf(result)).toBeNull()
})

test('createDecorationMap - uses Object.create(null) for prototype-less map', () => {
  const decorations = [{ decoration: 'modified', uri: '/home/user/file.txt' }]
  const result = createDecorationMap(decorations)
  expect(Object.getPrototypeOf(result)).toBeNull()
  expect(result).not.toHaveProperty('toString')
})

test('createDecorationMap - handles mixed paths and URIs', () => {
  const decorations = [
    { decoration: 'modified', uri: '/absolute/path.txt' },
    { decoration: 'added', uri: 'file:///already/uri.txt' },
    { decoration: 'deleted', uri: 'https://example.com/file.txt' },
  ]
  const result = createDecorationMap(decorations)
  expect(result).toEqual({
    'file:///absolute/path.txt': 'modified',
    'file:///already/uri.txt': 'added',
    'https://example.com/file.txt': 'deleted',
  })
})

test('createDecorationMap - handles duplicate URIs (last one wins)', () => {
  const decorations = [
    { decoration: 'modified', uri: '/home/user/file.txt' },
    { decoration: 'added', uri: '/home/user/file.txt' },
  ]
  const result = createDecorationMap(decorations)
  expect(result).toEqual({
    'file:///home/user/file.txt': 'added',
  })
})

test('createDecorationMap - handles empty decoration strings', () => {
  const decorations = [
    { decoration: '', uri: '/home/user/file1.txt' },
    { decoration: 'modified', uri: '/home/user/file2.txt' },
  ]
  const result = createDecorationMap(decorations)
  expect(result).toEqual({
    'file:///home/user/file1.txt': '',
    'file:///home/user/file2.txt': 'modified',
  })
})

test('createDecorationMap - handles root path', () => {
  const decorations = [{ decoration: 'modified', uri: '/' }]
  const result = createDecorationMap(decorations)
  expect(result).toEqual({
    'file:///': 'modified',
  })
})
