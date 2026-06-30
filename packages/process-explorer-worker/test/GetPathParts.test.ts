import { expect, test } from '@jest/globals'
import * as GetPathParts from '../src/parts/GetPathParts/GetPathParts.ts'
import * as PathSeparatorType from '../src/parts/PathSeparatorType/PathSeparatorType.ts'

test('getPathParts - empty path', () => {
  expect(GetPathParts.getPathParts('', '', PathSeparatorType.Slash)).toEqual([])
})

test('getPathParts - root path', () => {
  expect(GetPathParts.getPathParts('/', '/', PathSeparatorType.Slash)).toEqual([])
})

test('getPathParts - single level', () => {
  expect(GetPathParts.getPathParts('/root', '/root/folder', PathSeparatorType.Slash)).toEqual([
    {
      depth: 0,
      expanded: true,
      path: '/root',
      pathSeparator: '/',
      root: '/root',
    },
  ])
})

test('getPathParts - multiple levels', () => {
  expect(GetPathParts.getPathParts('/root', '/root/folder/subfolder/file.txt', PathSeparatorType.Slash)).toEqual([
    {
      depth: 0,
      expanded: true,
      path: '/root',
      pathSeparator: '/',
      root: '/root',
    },
    {
      depth: 1,
      expanded: true,
      path: '/root/folder',
      pathSeparator: '/',
      root: '/root',
    },
    {
      depth: 2,
      expanded: true,
      path: '/root/folder/subfolder',
      pathSeparator: '/',
      root: '/root',
    },
  ])
})

test('getPathParts - path equals root', () => {
  expect(GetPathParts.getPathParts('/root', '/root', PathSeparatorType.Slash)).toEqual([])
})

test('getPathParts - trailing slash', () => {
  expect(GetPathParts.getPathParts('/root', '/root/folder/', PathSeparatorType.Slash)).toEqual([
    {
      depth: 0,
      expanded: true,
      path: '/root',
      pathSeparator: '/',
      root: '/root',
    },
    {
      depth: 1,
      expanded: true,
      path: '/root/folder',
      pathSeparator: '/',
      root: '/root',
    },
  ])
})

test('getPathParts - multiple slashes', () => {
  expect(GetPathParts.getPathParts('/root', '/root/folder//subfolder', PathSeparatorType.Slash)).toEqual([
    {
      depth: 0,
      expanded: true,
      path: '/root',
      pathSeparator: '/',
      root: '/root',
    },
    {
      depth: 1,
      expanded: true,
      path: '/root/folder',
      pathSeparator: '/',
      root: '/root',
    },
    {
      depth: 2,
      expanded: true,
      path: '/root/folder/',
      pathSeparator: '/',
      root: '/root',
    },
  ])
})
