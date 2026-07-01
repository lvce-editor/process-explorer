import { expect, test } from '@jest/globals'
import * as GetAccurateMemoryUsage from '../src/parts/GetAccurateMemoryUsage/GetAccurateMemoryUsage.ts'

test('getAccurateMemoryUsage - invalid pid', async () => {
  await expect(
    GetAccurateMemoryUsage.getAccurateMemoryUsage('1' as any),
  ).rejects.toThrow('Failed to get accurate memory usage')
})

test('getAccurateMemoryUsage - missing process', async () => {
  const expected = process.platform === 'darwin' ? 0 : -1
  await expect(
    GetAccurateMemoryUsage.getAccurateMemoryUsage(Number.MAX_SAFE_INTEGER),
  ).resolves.toBe(expected)
})
