import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getNewChildDirentsForNewDirent } from '../src/parts/GetNewChildDirentsForNewDirent/GetNewChildDirentsForNewDirent.ts'

test.skip('getNewChildDirentsForNewDirent - empty directory', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const items = [
    {
      depth: 1,
      icon: '',
      name: 'folder',
      path: '/root/folder',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
    },
  ]

  const result = await getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.File)

  expect(result).toEqual([
    {
      depth: 2,
      icon: '',
      name: '',
      path: '',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.File,
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test.skip('getNewChildDirentsForNewDirent - directory with existing children', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const items = [
    {
      depth: 1,
      icon: '',
      name: 'folder',
      path: '/root/folder',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 2,
      icon: '',
      name: 'file1.txt',
      path: '/root/folder/file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: DirentType.File,
    },
    {
      depth: 2,
      icon: '',
      name: 'file2.txt',
      path: '/root/folder/file2.txt',
      posInSet: 2,
      selected: false,
      setSize: 2,
      type: DirentType.File,
    },
  ]

  const result = await getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.File)

  expect(result).toEqual([
    {
      depth: 2,
      icon: '',
      name: 'file1.txt',
      path: '/root/folder/file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 3,
      type: DirentType.File,
    },
    {
      depth: 2,
      icon: '',
      name: 'file2.txt',
      path: '/root/folder/file2.txt',
      posInSet: 2,
      selected: false,
      setSize: 3,
      type: DirentType.File,
    },
    {
      depth: 2,
      icon: '',
      name: '',
      path: '',
      posInSet: 3,
      selected: false,
      setSize: 3,
      type: DirentType.File,
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test.skip('getNewChildDirentsForNewDirent - directory with no children', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const items = [
    {
      depth: 1,
      icon: '',
      name: 'folder',
      path: '/root/folder',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
    },
  ]

  const result = await getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.DirectoryExpanded)

  expect(result).toEqual([
    {
      depth: 2,
      icon: '',
      name: '',
      path: '',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test.skip('getNewChildDirentsForNewDirent - different dirent types', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const items = [
    {
      depth: 1,
      icon: '',
      name: 'folder',
      path: '/root/folder',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 2,
      icon: '',
      name: 'file1.txt',
      path: '/root/folder/file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: DirentType.File,
    },
    {
      depth: 2,
      icon: '',
      name: 'folder1',
      path: '/root/folder/folder1',
      posInSet: 2,
      selected: false,
      setSize: 2,
      type: DirentType.DirectoryExpanded,
    },
  ]

  const result = await getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.SymLinkFolder)

  expect(result).toEqual([
    {
      depth: 2,
      icon: '',
      name: 'file1.txt',
      path: '/root/folder/file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 4,
      type: DirentType.File,
    },
    {
      depth: 2,
      icon: '',
      name: 'folder1',
      path: '/root/folder/folder1',
      posInSet: 2,
      selected: false,
      setSize: 4,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 2,
      icon: '',
      name: '',
      path: '',
      posInSet: 3,
      selected: false,
      setSize: 4,
      type: DirentType.SymLinkFolder,
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test.skip('getNewChildDirentsForNewDirent - error case', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      throw new Error('Failed to read directory')
    },
  })

  const items = [
    {
      depth: 1,
      icon: '',
      name: 'folder',
      path: '/root/folder',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
    },
  ]

  await expect(getNewChildDirentsForNewDirent(items, 2, '/root/folder', DirentType.File)).rejects.toThrow('Failed to read directory')
  expect(mockRpc.invocations).toEqual([])
})
