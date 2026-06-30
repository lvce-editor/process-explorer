import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ClipBoard from '../src/parts/ClipBoard/ClipBoard.ts'

test('writeText', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'() {},
  })
  await ClipBoard.writeText('test text')
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', 'test text']])
})

test('readNativeFiles', async () => {
  const expectedResult = {
    files: ['/test/file1.txt', '/test/file2.txt'],
    type: 'copy',
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.readNativeFiles'() {
      return expectedResult
    },
  })
  const result = await ClipBoard.readNativeFiles()
  expect(result).toEqual(expectedResult)
  expect(mockRpc.invocations).toEqual([['ClipBoard.readNativeFiles']])
})

test('writeNativeFiles', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeNativeFiles'() {},
  })
  await ClipBoard.writeNativeFiles('copy', ['/test/file.txt'])
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeNativeFiles', 'copy', ['/test/file.txt']]])
})
