import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule(
  '@vscode/windows-process-tree',
  () => ({
    getProcessList: jest.fn(),
  }),
  { virtual: true },
)

import * as LoadWindowsProcessTree from '../src/parts/LoadWindowsProcessTree/LoadWindowsProcessTree.ts'

test('loadWindowProcessTree', async () => {
  const module = await LoadWindowsProcessTree.loadWindowProcessTree()

  expect(module).toEqual(
    expect.objectContaining({
      getProcessList: expect.any(Function),
    }),
  )
})
