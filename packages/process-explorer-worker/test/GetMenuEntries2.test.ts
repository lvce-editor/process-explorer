import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { set } from '../src/parts/ExplorerStates/ExplorerStates.ts'
import { getMenuEntries2 } from '../src/parts/GetMenuEntries2/GetMenuEntries2.ts'

test('getMenuEntries2 - root', () => {
  const uid = 1
  const state: ExplorerState = createDefaultState()
  set(uid, state, state)
  const menuEntries = getMenuEntries2(state)
  expect(menuEntries.length).toBeGreaterThan(0)
})

test('getMenuEntries2 - directory', () => {
  const uid = 1
  const item: ExplorerItem = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: true,
    type: DirentType.Directory,
  }
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [item],
  }
  set(uid, state, state)
  const menuEntries = getMenuEntries2(state)
  expect(menuEntries.length).toBeGreaterThan(0)
})

test('getMenuEntries2 - file', () => {
  const uid = 1
  const item: ExplorerItem = {
    depth: 0,
    name: 'test.txt',
    path: '/test.txt',
    selected: false,
    type: DirentType.File,
  }
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [item],
  }
  set(uid, state, state)
  const menuEntries = getMenuEntries2(state)
  expect(menuEntries.length).toBeGreaterThan(0)
})

test('getMenuEntries2 - file shows select for compare by default', () => {
  const uid = 1
  const item: ExplorerItem = {
    depth: 0,
    name: 'test.txt',
    path: '/test.txt',
    selected: false,
    type: DirentType.File,
  }
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [item],
  }
  set(uid, state, state)
  const menuEntries = getMenuEntries2(state)
  expect(menuEntries.some((entry) => entry.id === 'selectForCompare')).toBe(true)
  expect(menuEntries.some((entry) => entry.id === 'compareWithSelected')).toBe(false)
})

test('getMenuEntries2 - file shows compare with selected for different file', () => {
  const uid = 1
  const item: ExplorerItem = {
    depth: 0,
    name: 'test.txt',
    path: '/test.txt',
    selected: false,
    type: DirentType.File,
  }
  const state: ExplorerState = {
    ...createDefaultState(),
    compareSourceUri: '/other.txt',
    focusedIndex: 0,
    items: [item],
  }
  set(uid, state, state)
  const menuEntries = getMenuEntries2(state)
  expect(menuEntries.some((entry) => entry.id === 'compareWithSelected')).toBe(true)
  expect(menuEntries.some((entry) => entry.id === 'selectForCompare')).toBe(false)
})
