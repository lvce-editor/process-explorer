import { expect, jest, test } from '@jest/globals'

const readdir = jest.fn(async (_path: string) => ['socket', 'regular', 'gone'])
const readlink = jest.fn(async (path: string) => {
  if (path.endsWith('/socket')) return 'socket:[12345]'
  if (path.endsWith('/gone')) throw new Error('descriptor closed')
  return '/dev/null'
})
const readFile = jest.fn(async (path: string) => {
  if (path.endsWith('/tcp6')) throw new Error('IPv6 table unavailable')
  return 'header\n0: 0100007F:2405 00000000:0000 0A 00000000:00000000 00:00000000 00000000 1000 0 12345 1'
})

// Mock procfs so socket and disappearing-file outcomes are covered on every CI OS.
// eslint-disable-next-line jest/no-restricted-jest-methods
jest.unstable_mockModule('node:fs/promises', () => ({
  readdir,
  readFile,
  readlink,
}))

const GetLinuxProcessListeningPorts =
  await import('../src/parts/GetLinuxProcessListeningPorts/GetLinuxProcessListeningPorts.ts')

test('finds a process port while ignoring closed and non-socket descriptors', async () => {
  await expect(
    GetLinuxProcessListeningPorts.getLinuxProcessListeningPorts(123),
  ).resolves.toEqual([9221])
  expect(readdir).toHaveBeenCalledWith('/proc/123/fd')
  expect(readFile).toHaveBeenCalledTimes(2)
})
