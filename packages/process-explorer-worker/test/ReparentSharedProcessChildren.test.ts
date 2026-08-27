import { expect, test } from '@jest/globals'
import type { ProcessInfo } from '../src/parts/ProcessInfo/ProcessInfo.ts'
import * as ReparentSharedProcessChildren from '../src/parts/ReparentSharedProcessChildren/ReparentSharedProcessChildren.ts'

const createProcess = (
  name: string,
  pid: number,
  ppid: number,
): ProcessInfo => ({
  cmd: name,
  memory: 1,
  name,
  pid,
  ppid,
})

test('reparents conceptual children below the shared process', () => {
  const processes = [
    createProcess('main', 1, 0),
    createProcess('shared-process', 2, 1),
    createProcess('file-system-process', 3, 1),
    createProcess('file-watcher-process', 4, 1),
    createProcess('embeds-process', 5, 1),
    createProcess('process-explorer', 6, 1),
    createProcess('terminal-process', 7, 1),
    createProcess('bash', 8, 7),
    createProcess('extension-host', 9, 1),
  ]

  const result =
    ReparentSharedProcessChildren.reparentSharedProcessChildren(processes)

  expect(result.map((process) => process.ppid)).toEqual([
    0, 1, 2, 2, 2, 2, 2, 7, 1,
  ])
})

test('returns the processes unchanged when there is no shared process', () => {
  const processes = [
    createProcess('main', 1, 0),
    createProcess('terminal-process', 2, 1),
  ]

  expect(
    ReparentSharedProcessChildren.reparentSharedProcessChildren(processes),
  ).toBe(processes)
})
