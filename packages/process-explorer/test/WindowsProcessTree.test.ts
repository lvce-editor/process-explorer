import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('@vscode/windows-process-tree', () => ({
  getProcessList: jest.fn(),
}))

const WindowsProcessTree =
  await import('../src/parts/WindowsProcessTree/WindowsProcessTree.ts')
const WindowsProcessTreeModule = await import('@vscode/windows-process-tree')

test('getProcessList', async () => {
  // @ts-ignore
  WindowsProcessTreeModule.getProcessList.mockImplementation(
    (
      pid: number,
      callback: (processList: readonly unknown[]) => void,
      flags: number,
    ): void => {
      callback([])
    },
  )
  const rootPid = 1
  const flags = 1
  expect(await WindowsProcessTree.getProcessList(rootPid, flags)).toEqual([])
})
