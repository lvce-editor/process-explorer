import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as IsSymbolicLink from '../src/parts/IsSymbolicLink/IsSymbolicLink.ts'

test('isSymbolicLink - symlink', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'symlink',
    path: '/symlink',
    selected: false,
    type: DirentType.Symlink,
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(true)
})

test('isSymbolicLink - file', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'file.txt',
    path: '/file.txt',
    selected: false,
    type: DirentType.File,
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})

test('isSymbolicLink - directory', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'directory',
    path: '/directory',
    selected: false,
    type: DirentType.Directory,
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})

test('isSymbolicLink - symlink file', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'symlink-file',
    path: '/symlink-file',
    selected: false,
    type: DirentType.SymLinkFile,
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})

test('isSymbolicLink - symlink folder', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'symlink-folder',
    path: '/symlink-folder',
    selected: false,
    type: DirentType.SymLinkFolder,
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})
