import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { openDiff } from '../src/parts/OpenDiff/OpenDiff.ts'

test('openDiff opens file diff uri', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri'() {},
  })

  await openDiff('/left.txt', '/right.txt', true)

  expect(mockRpc.invocations).toEqual([['Main.openUri', 'diff:///left.txt<->/right.txt', true]])
})
