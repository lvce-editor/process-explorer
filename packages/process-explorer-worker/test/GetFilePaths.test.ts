import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getFilePaths } from '../src/parts/GetFilePaths/GetFilePaths.ts'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.ts'

test('getFilePaths - non-electron platform', async () => {
  const files = [new File([], 'test.txt')]
  const paths = await getFilePaths(files, PlatformType.Web)
  expect(paths).toEqual([''])
})

test('getFilePaths - electron platform', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFilePathElectron'() {
      return '/path/to/file'
    },
  })

  const files = [new File([], 'test.txt')]
  const paths = await getFilePaths(files, PlatformType.Electron)
  expect(paths).toEqual(['/path/to/file'])
  expect(mockRpc.invocations).toEqual([['FileSystemHandle.getFilePathElectron', files[0]]])
})

test('getFilePaths - multiple files', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFilePathElectron'() {
      return '/path/to/file'
    },
  })

  const files = [new File([], 'test1.txt'), new File([], 'test2.txt')]
  const paths = await getFilePaths(files, PlatformType.Electron)
  expect(paths).toEqual(['/path/to/file', '/path/to/file'])
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFilePathElectron', files[0]],
    ['FileSystemHandle.getFilePathElectron', files[1]],
  ])
})
