import { expect, jest, test } from '@jest/globals'
import * as AddAccurateMemoryUsage from '../src/parts/AddAccurateMemoryUsage/AddAccurateMemoryUsage.ts'

const processItem = {
  cmd: '/Applications/Lvce.app/Contents/MacOS/Lvce',
  depth: 1,
  memory: 13_107_200,
  name: 'main',
  pid: 6341,
  ppid: 5373,
}

test('addAccurateMemoryUsageForPlatform - keeps ps RSS memory on macOS', async () => {
  const getAccurateMemoryUsage = jest.fn<(pid: number) => Promise<number>>(
    async () => 0,
  )
  await expect(
    AddAccurateMemoryUsage.addAccurateMemoryUsageForPlatform(
      processItem,
      true,
      getAccurateMemoryUsage,
    ),
  ).resolves.toEqual(processItem)
  expect(getAccurateMemoryUsage).not.toHaveBeenCalled()
})

test('addAccurateMemoryUsageForPlatform - uses proc memory on Linux', async () => {
  const getAccurateMemoryUsage = jest.fn<(pid: number) => Promise<number>>(
    async () => 8_286_208,
  )
  await expect(
    AddAccurateMemoryUsage.addAccurateMemoryUsageForPlatform(
      processItem,
      false,
      getAccurateMemoryUsage,
    ),
  ).resolves.toEqual({
    ...processItem,
    memory: 8_286_208,
  })
  expect(getAccurateMemoryUsage).toHaveBeenCalledWith(6341)
})
