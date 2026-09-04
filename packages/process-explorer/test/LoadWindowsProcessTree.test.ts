import { expect, jest, test } from '@jest/globals'

const getProcessList = jest.fn()

jest.unstable_mockModule(
  '@vscode/windows-process-tree',
  () => ({ getProcessList }),
  { virtual: true },
)

const LoadWindowsProcessTree =
  await import('../src/parts/LoadWindowsProcessTree/LoadWindowsProcessTree.ts')

test('loadWindowProcessTree', async () => {
  const module = await LoadWindowsProcessTree.loadWindowProcessTree()

  expect(module).toEqual(
    expect.objectContaining({
      getProcessList,
    }),
  )
})
