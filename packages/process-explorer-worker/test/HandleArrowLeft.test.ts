import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleArrowLeft } from '../src/parts/HandleArrowLeft/HandleArrowLeft.ts'

test('handleArrowLeft - no focused item', () => {
  const state: ExplorerState = { ...createDefaultState(), focusedIndex: -1 }
  const result = handleArrowLeft(state)
  expect(result).toBe(state)
})

test('handleArrowLeft - directory', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        name: 'test',
        path: '/test',
        selected: false,
        type: DirentType.Directory,
      },
    ],
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})

test('handleArrowLeft - file', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        name: 'test.txt',
        path: '/test.txt',
        selected: false,
        type: DirentType.File,
      },
    ],
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})

test('handleArrowLeft - symlink file', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        name: 'test.txt',
        path: '/test.txt',
        selected: false,
        type: DirentType.SymLinkFile,
      },
    ],
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})

test('handleArrowLeft - expanded directory', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        // @ts-ignore
        expanded: true,
        level: 0,
        name: 'test',
        path: '/test',
        selected: false,
        type: DirentType.DirectoryExpanded,
      },
    ],
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})

test('handleArrowLeft - expanding directory', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        name: 'test',
        path: '/test',
        selected: false,
        type: DirentType.DirectoryExpanding,
      },
    ],
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})

test('handleArrowLeft - symlink folder', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        name: 'test',
        path: '/test',
        selected: false,
        type: DirentType.SymLinkFolder,
      },
    ],
  }
  const result = handleArrowLeft(state)
  expect(result).toBeDefined()
})
