import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { acceptCreate } from '../src/parts/AcceptCreate/AcceptCreate.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as ExplorerStrings from '../src/parts/ExplorerStrings/ExplorerStrings.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'

test.skip('acceptCreate - empty file name', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingValue: '',
  }

  const result = await acceptCreate(state, DirentType.File)
  expect(result).toEqual({
    ...state,
    editingErrorMessage: ExplorerStrings.fileOrFolderNameMustBeProvided(),
  })
})

test('acceptCreate - successful file creation', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.mkdir'() {
      return
    },
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === 'memfs:///workspace') {
        return [{ name: 'test', type: DirentType.Directory }]
      }
      if (path === 'memfs:///workspace/test') {
        return [{ name: 'test.txt', type: DirentType.File }]
      }
      throw new Error(`unexpected file read ${path}`)
    },
    'FileSystem.writeFile'() {
      return
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return Array(2).fill('')
    },
    'Main.openUri'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 1,
    editingValue: 'test.txt',
    fileIconCache: {},
    focusedIndex: 0,
    height: 100,
    itemHeight: 20,
    items: [
      {
        depth: 0,
        name: 'test',
        path: 'memfs:///workspace/test',
        selected: false,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'test.txt',
        path: 'memfs:///workspace/test/test.txt',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.EditingFile,
      },
    ],
    minLineY: 0,
    root: 'memfs:///workspace',
  }

  const result = await acceptCreate(state, DirentType.File)
  expect(result).toEqual({
    ...state,
    editingIndex: -1,
    editingType: ExplorerEditingType.None,
    focus: FocusId.List,
    focusedIndex: 1,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'test',
        path: 'memfs:///workspace/test',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'test.txt',
        path: 'memfs:///workspace/test/test.txt',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  })
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.mkdir', 'memfs:///workspace/test'],
    ['FileSystem.writeFile', 'memfs:///workspace/test/test.txt', ''],
    ['FileSystem.readDirWithFileTypes', 'memfs:///workspace'],
    ['FileSystem.readDirWithFileTypes', 'memfs:///workspace/test'],
    ['Layout.handleWorkspaceRefresh'],
    ['Main.openUri', 'memfs:///workspace/test/test.txt', true],
  ])
})

test('acceptCreate - successful folder creation does not open uri', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.mkdir'() {
      return
    },
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === 'memfs:///workspace') {
        return [{ name: 'test', type: DirentType.Directory }]
      }
      if (path === 'memfs:///workspace/test') {
        return [{ name: 'newfolder', type: DirentType.Directory }]
      }
      throw new Error(`unexpected file read ${path}`)
    },
    'FileSystem.writeFile'() {
      return
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return Array(2).fill('')
    },
    'Main.openUri'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 1,
    editingValue: 'newfolder',
    fileIconCache: {},
    focusedIndex: 0,
    height: 100,
    itemHeight: 20,
    items: [
      {
        depth: 0,
        name: 'test',
        path: 'memfs:///workspace/test',
        selected: false,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'newfolder',
        path: 'memfs:///workspace/test/newfolder',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.EditingFolder,
      },
    ],
    minLineY: 0,
    root: 'memfs:///workspace',
  }

  const result = await acceptCreate(state, DirentType.Directory)
  expect(result.editingIndex).toBe(-1)
  expect(result.editingType).toBe(ExplorerEditingType.None)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.mkdir', 'memfs:///workspace/test'],
    ['FileSystem.mkdir', 'memfs:///workspace/test/newfolder'],
    ['FileSystem.readDirWithFileTypes', 'memfs:///workspace'],
    ['FileSystem.readDirWithFileTypes', 'memfs:///workspace/test'],
    ['Layout.handleWorkspaceRefresh'],
  ])
})

test('acceptCreate - nested folder creation uses the file parent when a file is focused', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.mkdir'() {
      return
    },
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === 'memfs:///workspace') {
        return [
          { name: 'a', type: DirentType.Directory },
          { name: 'file1.txt', type: DirentType.File },
        ]
      }
      if (path === 'memfs:///workspace/a') {
        return [{ name: 'b', type: DirentType.Directory }]
      }
      if (path === 'memfs:///workspace/a/b') {
        return [{ name: 'c', type: DirentType.Directory }]
      }
      throw new Error(`unexpected file read ${path}`)
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return Array(5).fill('')
    },
    'Main.openUri'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 1,
    editingValue: 'a/b/c',
    fileIconCache: {},
    focusedIndex: 0,
    height: 100,
    itemHeight: 20,
    items: [
      {
        depth: 0,
        icon: '',
        name: 'file1.txt',
        path: 'memfs:///workspace/file1.txt',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.File,
      },
      {
        depth: 0,
        icon: '',
        name: '',
        path: 'memfs:///workspace',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.EditingFolder,
      },
    ],
    minLineY: 0,
    pathSeparator: '/',
    root: 'memfs:///workspace',
  }

  await acceptCreate(state, DirentType.Directory)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.mkdir', 'memfs:///workspace/a'],
    ['FileSystem.mkdir', 'memfs:///workspace/a/b'],
    ['FileSystem.mkdir', 'memfs:///workspace/a/b/c'],
    ['FileSystem.readDirWithFileTypes', 'memfs:///workspace'],
    ['FileSystem.readDirWithFileTypes', 'memfs:///workspace/a'],
    ['FileSystem.readDirWithFileTypes', 'memfs:///workspace/a/b'],
    ['Layout.handleWorkspaceRefresh'],
  ])
})
