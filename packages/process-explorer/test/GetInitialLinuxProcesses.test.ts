import { expect, test } from '@jest/globals'
import * as GetInitialLinuxProcesses from '../src/parts/GetInitialLinuxProcesses/GetInitialLinuxProcesses.ts'

test('returns no processes when the root and its children are absent', () => {
  expect(
    GetInitialLinuxProcesses.getInitialLinuxProcesses({}, {}, 123),
  ).toEqual([])
})

test('returns direct children when the root process is absent', () => {
  const child = { command: 'node', memory: 1024, pid: 456, ppid: 123 }

  expect(
    GetInitialLinuxProcesses.getInitialLinuxProcesses(
      {},
      { 123: [child] },
      123,
    ),
  ).toEqual([{ ...child, depth: 1 }])
})
