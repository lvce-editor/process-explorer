import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import * as InputSource from '../src/parts/InputSource/InputSource.ts'
import { renameDirent } from '../src/parts/RenameDirent/RenameDirent.ts'

test('renameDirent updates state with editing properties', async () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    icons: [''],
    items: [{ depth: 0, name: 'test.txt', path: '/test.txt', selected: false, type: DirentType.File }],
  }

  const result = await renameDirent(mockState)
  expect(result).toEqual({
    ...mockState,
    editingIcon: '',
    editingIndex: 0,
    editingSelectionEnd: 4,
    editingSelectionStart: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'test.txt',
    focus: FocusId.Input,
    inputSource: InputSource.Script,
    items: [{ depth: 0, name: 'test.txt', path: '/test.txt', selected: false, type: DirentType.EditingFile }],
  })
})

test('renameDirent updates state with editing properties for folder', async () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    icons: [''],
    items: [{ depth: 0, name: 'test', path: '/test', selected: false, type: DirentType.Directory }],
  }

  const result = await renameDirent(mockState)
  expect(result).toEqual({
    ...mockState,
    editingIcon: '',
    editingIndex: 0,
    editingSelectionEnd: 4,
    editingSelectionStart: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'test',
    focus: FocusId.Input,
    inputSource: InputSource.Script,
    items: [{ depth: 0, name: 'test', path: '/test', selected: false, type: DirentType.EditingFolder }],
  })
})

test('renameDirent handles empty state', async () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }

  const result = await renameDirent(mockState)
  expect(result).toBe(mockState)
})

test('renameDirent preserves icon when entering edit mode', async () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    icons: ['file-icon'],
    items: [{ depth: 0, icon: 'file-icon', name: 'test.txt', path: '/test.txt', selected: false, type: DirentType.File }],
    minLineY: 0,
  }

  const result = await renameDirent(mockState)
  expect(result).toEqual({
    ...mockState,
    editingIcon: 'file-icon',
    editingIndex: 0,
    editingSelectionEnd: 4,
    editingSelectionStart: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'test.txt',
    focus: FocusId.Input,
    inputSource: InputSource.Script,
    items: [{ depth: 0, icon: 'file-icon', name: 'test.txt', path: '/test.txt', selected: false, type: DirentType.EditingFile }],
  })
})
