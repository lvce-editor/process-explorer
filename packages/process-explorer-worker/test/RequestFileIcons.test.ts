import { test, expect } from '@jest/globals'
import { IconThemeWorker } from '@lvce-editor/rpc-registry'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as RequestFileIcons from '../src/parts/RequestFileIcons/RequestFileIcons.ts'

test('requestFileIcons - empty requests', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({})

  const result = await RequestFileIcons.requestFileIcons([])
  expect(result).toEqual([])
  expect(mockRpc.invocations).toEqual([])
})

test('requestFileIcons - file icons', async () => {
  const requests = [{ name: 'file.txt', path: '/test/file.txt', type: DirentType.File }]

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons'() {
      return ['file-icon']
    },
  })

  const result = await RequestFileIcons.requestFileIcons(requests)
  expect(result).toEqual(['file-icon'])
  expect(mockRpc.invocations).toEqual([['IconTheme.getIcons', [{ name: 'file.txt', type: 1 }]]])
})

test('requestFileIcons - folder icons', async () => {
  const requests = [{ name: 'folder', path: '/test/folder', type: DirentType.Directory }]

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons'() {
      return ['folder-icon']
    },
  })

  const result = await RequestFileIcons.requestFileIcons(requests)
  expect(result).toEqual(['folder-icon'])
  expect(mockRpc.invocations).toEqual([['IconTheme.getIcons', [{ name: 'folder', type: 2 }]]])
})

test('requestFileIcons - mixed requests', async () => {
  const requests = [
    { name: 'file.txt', path: '/test/file.txt', type: DirentType.File },
    { name: 'folder', path: '/test/folder', type: DirentType.Directory },
  ]

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons'() {
      return ['file-icon', 'folder-icon']
    },
  })

  const result = await RequestFileIcons.requestFileIcons(requests)
  expect(result).toEqual(['file-icon', 'folder-icon'])
  expect(mockRpc.invocations).toEqual([
    [
      'IconTheme.getIcons',
      [
        { name: 'file.txt', type: 1 },
        { name: 'folder', type: 2 },
      ],
    ],
  ])
})
