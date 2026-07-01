import { expect, test } from '@jest/globals'
import * as LoadWindowsProcessTree from '../src/parts/LoadWindowsProcessTree/LoadWindowsProcessTree.ts'

test('loadWindowProcessTree', async () => {
  const module = await LoadWindowsProcessTree.loadWindowProcessTree()

  expect(module).toEqual(
    expect.objectContaining({
      getProcessList: expect.any(Function),
    }),
  )
})
