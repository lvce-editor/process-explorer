import { expect, test } from '@jest/globals'
import * as HasPositiveMemoryUsage from '../src/parts/HasPositiveMemoryUsage/HasPositiveMemoryUsage.ts'
import * as IsMacos from '../src/parts/IsMacos/IsMacos.ts'
import * as IsWindows from '../src/parts/IsWindows/IsWindows.ts'
import * as ParseMemory from '../src/parts/ParseMemory/ParseMemory.ts'
import * as ProcessId from '../src/parts/ProcessId/ProcessId.ts'
import * as RequiresSocket from '../src/parts/RequiresSocket/RequiresSocket.ts'
import * as SplitLines from '../src/parts/SplitLines/SplitLines.ts'

test('parseMemory', () => {
  expect(ParseMemory.parseMemory('100 5 2 0 0 0 0')).toBe(12_288)
})

test('hasPositiveMemoryUsage', () => {
  expect(HasPositiveMemoryUsage.hasPositiveMemoryUsage({ memory: 0 })).toBe(
    true,
  )
  expect(HasPositiveMemoryUsage.hasPositiveMemoryUsage({ memory: -1 })).toBe(
    false,
  )
})

test('splitLines', () => {
  expect(SplitLines.splitLines('a\nb\n')).toEqual(['a', 'b', ''])
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
