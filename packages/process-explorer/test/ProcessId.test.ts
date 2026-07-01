import { expect, test } from '@jest/globals'
import * as ProcessId from '../src/parts/ProcessId/ProcessId.ts'

test('getMainProcessId - default returns parent process id', async () => {
  expect(await ProcessId.getMainProcessId()).toBe(process.ppid)
})

test('getMainProcessId - remote returns grandparent process id', async () => {
  if (process.platform === 'win32') {
    return
  }
  expect(await ProcessId.getMainProcessId(false, process.pid)).toBe(
    process.ppid,
  )
})

test('getMainProcessId - remote falls back to parent process id when lookup fails', async () => {
  expect(await ProcessId.getMainProcessId(false, Number.MAX_SAFE_INTEGER)).toBe(
    process.ppid,
  )
})
