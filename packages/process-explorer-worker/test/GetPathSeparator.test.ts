import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as GetPathSeparator from '../src/parts/GetPathSeparator/GetPathSeparator.ts'

test('getPathSeparator - delegates to file system module', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
  })

  const result = await GetPathSeparator.getPathSeparator('/workspace')

  expect(result).toBe('/')
  expect(mockRpc.invocations).toEqual([['FileSystem.getPathSeparator', '/workspace']])
})
