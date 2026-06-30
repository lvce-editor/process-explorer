import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { confirmDelete } from '../src/parts/ConfirmDelete/ConfirmDelete.ts'

test('confirmDelete - single file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      return true
    },
  })
  const result = await confirmDelete(['/test/file.txt'])
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['ConfirmPrompt.prompt', 'Are you sure you want to delete "/test/file.txt"?', undefined]])
})

test('confirmDelete - multiple files', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'() {
      return false
    },
  })

  const result = await confirmDelete(['/test/file1.txt', '/test/file2.txt', '/test/file3.txt'])
  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['ConfirmPrompt.prompt', 'Are you sure you want to delete 3 items?', undefined]])
})
