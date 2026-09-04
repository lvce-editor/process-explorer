import { expect, test } from '@jest/globals'
import * as HasPositiveMemoryUsage from '../src/parts/HasPositiveMemoryUsage/HasPositiveMemoryUsage.ts'
import * as IsMacos from '../src/parts/IsMacos/IsMacos.ts'
import * as IsWindows from '../src/parts/IsWindows/IsWindows.ts'
import * as ProcessId from '../src/parts/ProcessId/ProcessId.ts'
import * as RequiresSocket from '../src/parts/RequiresSocket/RequiresSocket.ts'

test('hasPositiveMemoryUsage', () => {
  expect(HasPositiveMemoryUsage.hasPositiveMemoryUsage({ memory: 0 })).toBe(
    true,
  )
  expect(HasPositiveMemoryUsage.hasPositiveMemoryUsage({ memory: -1 })).toBe(
    false,
  )
})

test('getMainProcessId', async () => {
  expect(await ProcessId.getMainProcessId()).toBe(process.ppid)
})

test('requiresSocket', () => {
  expect(RequiresSocket.requiresSocket()).toBe(false)
})

test('platform flags', () => {
  expect(IsMacos.isMacOs).toBe(process.platform === 'darwin')
  expect(IsWindows.isWindows).toBe(process.platform === 'win32')
})
