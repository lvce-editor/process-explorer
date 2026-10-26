import { expect, test } from '@jest/globals'
import * as GetLinuxProcessTree from '../src/parts/GetLinuxProcessTree/GetLinuxProcessTree.ts'

test('returns a root process without children', () => {
  expect(
    GetLinuxProcessTree.getLinuxProcessTree(
      [{ command: 'node', memory: 10, pid: 123, ppid: 1 }],
      123,
    ),
  ).toEqual([{ command: 'node', depth: 1, memory: 10, pid: 123, ppid: 1 }])
})

test('includes descendants beneath the root process', () => {
  expect(
    GetLinuxProcessTree.getLinuxProcessTree(
      [
        { command: 'node', memory: 10, pid: 123, ppid: 1 },
        { command: 'worker', memory: 20, pid: 456, ppid: 123 },
      ],
      123,
    ),
  ).toEqual([
    { command: 'node', depth: 1, memory: 10, pid: 123, ppid: 1 },
    { command: 'worker', depth: 2, memory: 20, pid: 456, ppid: 123 },
  ])
})
