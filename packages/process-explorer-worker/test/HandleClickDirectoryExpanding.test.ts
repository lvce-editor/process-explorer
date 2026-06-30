import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleClickDirectoryExpanding } from '../src/parts/HandleClickDirectoryExpanding/HandleClickDirectoryExpanding.ts'

test('handleClickDirectoryExpanding - updates state with focus', async () => {
  const state: ExplorerState = createDefaultState()
  const dirent = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.File,
  }
  const newState = await handleClickDirectoryExpanding(state, dirent, 1, true)
  expect(newState.focusedIndex).toBe(1)
  expect(newState.focused).toBe(true)
  expect(dirent.type).toBe(DirentType.Directory)
})

test('handleClickDirectoryExpanding - updates state without focus', async () => {
  const state: ExplorerState = createDefaultState()
  const dirent = {
    depth: 0,
    name: 'test',
    path: '/test',
    selected: false,
    type: DirentType.File,
  }
  const newState = await handleClickDirectoryExpanding(state, dirent, 2, false)
  expect(newState.focusedIndex).toBe(2)
  expect(newState.focused).toBe(false)
  expect(dirent.type).toBe(DirentType.Directory)
})
