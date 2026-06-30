import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import * as ViewletExplorerAcceptEdit from '../src/parts/AcceptEdit/AcceptEdit.ts'
import * as ViewletExplorer from '../src/parts/Create/Create.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as ExplorerStrings from '../src/parts/ExplorerStrings/ExplorerStrings.ts'
import * as FileSystem from '../src/parts/FileSystem/FileSystem.ts'
import * as PathSeparatorType from '../src/parts/PathSeparatorType/PathSeparatorType.ts'

test('acceptEdit - default returns state', async () => {
  const state: ExplorerState = {
    ...ViewletExplorer.create(1, '', 0, 0, 0, 0, [], 0),
    editingType: ExplorerEditingType.None,
  }
  expect(await ViewletExplorerAcceptEdit.acceptEdit(state)).toBe(state)
})

test('acceptEdit - create file validates empty name', async () => {
  const state: ExplorerState = {
    ...ViewletExplorer.create(1, '', 0, 0, 0, 0, [], 0),
    editingType: ExplorerEditingType.CreateFile,
    editingValue: '',
  }
  expect(await ViewletExplorerAcceptEdit.acceptEdit(state)).toEqual({
    ...state,
    editingErrorMessage: ExplorerStrings.fileOrFolderNameMustBeProvided(),
  })
})

test('acceptEdit - create folder validates empty name', async () => {
  const state: ExplorerState = {
    ...ViewletExplorer.create(1, '', 0, 0, 0, 0, [], 0),
    editingType: ExplorerEditingType.CreateFolder,
    editingValue: '',
  }
  expect(await ViewletExplorerAcceptEdit.acceptEdit(state)).toEqual({
    ...state,
    editingErrorMessage: ExplorerStrings.fileOrFolderNameMustBeProvided(),
  })
})

test('acceptEdit - rename validates empty name', async () => {
  const state: ExplorerState = {
    ...ViewletExplorer.create(1, '', 0, 0, 0, 0, [], 0),
    editingType: ExplorerEditingType.Rename,
    editingValue: '',
  }
  expect(await ViewletExplorerAcceptEdit.acceptEdit(state)).toEqual({
    ...state,
    editingErrorMessage: ExplorerStrings.fileOrFolderNameMustBeProvided(),
  })
})

test.skip('acceptEdit - rename', async () => {
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  const state: ExplorerState = {
    ...ViewletExplorer.create(1, '', 0, 0, 0, 0, [], 0),
    deltaY: 0,
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'b.txt',
    focusedIndex: 0,
    height: 600,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a.txt',
        path: '/test/a.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
    maxLineY: 2,
    minLineY: 1,
    pathSeparator: PathSeparatorType.Slash,
    root: '/test',
    top: 0,
  }
  expect(await ViewletExplorerAcceptEdit.acceptEdit(state)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'b.txt',
        path: '/test/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  })
  expect(FileSystem.rename).toHaveBeenCalledTimes(1)
  expect(FileSystem.rename).toHaveBeenCalledWith('/test/a.txt', '/test/b.txt')
})

test.skip('acceptEdit - rename - nested file', async () => {
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  const state: ExplorerState = {
    ...ViewletExplorer.create(1, '', 0, 0, 0, 0, [], 0),
    deltaY: 0,
    editingIndex: 1,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'c.txt',
    focusedIndex: 0,
    height: 600,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
    maxLineY: 2,
    minLineY: 1,
    pathSeparator: PathSeparatorType.Slash,
    root: '/test',
    top: 0,
  }
  expect(await ViewletExplorerAcceptEdit.acceptEdit(state)).toMatchObject({
    focusedIndex: 1,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/test/a/c.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  })
})

test.skip('acceptEdit - create - insert folder', async () => {
  // @ts-ignore
  FileSystem.mkdir.mockImplementation(() => {})
  const state: ExplorerState = {
    ...ViewletExplorer.create(1, '', 0, 0, 0, 0, [], 0),
    deltaY: 0,
    editingIndex: 0,
    editingType: ExplorerEditingType.CreateFolder,
    editingValue: 'c',
    focusedIndex: -1,
    height: 600,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'b',
        path: '/test/b',
        posInSet: 2,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'd',
        path: '/test/d',
        posInSet: 3,
        setSize: 3,
        type: DirentType.Directory,
      },
    ],
    maxLineY: 2,
    minLineY: 1,
    pathSeparator: PathSeparatorType.Slash,
    root: '/test',
    top: 0,
  }
  expect(await ViewletExplorerAcceptEdit.acceptEdit(state)).toMatchObject({
    focusedIndex: 2,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 4,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'b',
        path: '/test/b',
        posInSet: 2,
        setSize: 4,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'c',
        path: '/test/c',
        posInSet: 3,
        setSize: 4,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'd',
        path: '/test/d',
        posInSet: 3, // TODO should be 4
        setSize: 3, // TODO should be 4
        type: DirentType.Directory,
      },
    ],
  })
})
