import { expect, test } from '@jest/globals'
import * as ReadLinuxProcessCommandLine from '../src/parts/ReadLinuxProcessCommandLine/ReadLinuxProcessCommandLine.ts'

test('returns undefined when procfs no longer has the process', () => {
  expect(
    ReadLinuxProcessCommandLine.readLinuxProcessCommandLine({
      command: 'stale process',
      depth: 1,
      memory: 0,
      pid: Number.MAX_SAFE_INTEGER,
      ppid: 0,
    }),
  ).toBeUndefined()
})

test('reads the current process command line', () => {
  const commandLine = ReadLinuxProcessCommandLine.readLinuxProcessCommandLine({
    command: 'fallback',
    depth: 1,
    memory: 0,
    pid: process.pid,
    ppid: process.ppid,
  })

  expect(commandLine).toContain('jest/bin/jest.js')
})
