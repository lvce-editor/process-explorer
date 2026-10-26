import { beforeEach, expect, jest, test } from '@jest/globals'

type ExecFileCallback = (
  error: Error | null,
  result?: { readonly stdout: string },
) => void

const execFile =
  jest.fn<
    (
      command: string,
      args: readonly string[],
      callback: ExecFileCallback,
    ) => void
  >()

jest.unstable_mockModule('node:child_process', () => ({
  execFile,
}))

const ProcessId = await import('../src/parts/ProcessId/ProcessId.ts')

beforeEach(() => {
  jest.clearAllMocks()
})

test('getMainProcessId - default returns parent process id', async () => {
  expect(await ProcessId.getMainProcessId()).toBe(process.ppid)
})

test('getMainProcessId - remote returns grandparent process id', async () => {
  execFile.mockImplementation((_command, _args, callback) => {
    callback(null, { stdout: String(process.ppid) })
  })
  expect(
    await ProcessId.getMainProcessId({
      childProcessId: process.pid,
      includeElectronData: false,
    }),
  ).toBe(process.ppid)
})

test('getMainProcessId - remote uses the current parent as the child by default', async () => {
  execFile.mockImplementation((_command, _args, callback) => {
    callback(null, { stdout: String(process.ppid) })
  })

  expect(await ProcessId.getMainProcessId({ includeElectronData: false })).toBe(
    process.ppid,
  )
  expect(execFile).toHaveBeenCalledWith(
    'ps',
    ['-o', 'ppid=', '-p', String(process.ppid)],
    expect.any(Function),
  )
})

test('getMainProcessId - remote falls back when the parent process id is zero', async () => {
  execFile.mockImplementation((_command, _args, callback) => {
    callback(null, { stdout: '0' })
  })

  expect(
    await ProcessId.getMainProcessId({
      childProcessId: process.pid,
      includeElectronData: false,
    }),
  ).toBe(process.ppid)
})

test('getMainProcessId - remote falls back to parent process id when lookup fails', async () => {
  execFile.mockImplementation((_command, _args, callback) => {
    callback(new Error('lookup failed'))
  })
  expect(
    await ProcessId.getMainProcessId({
      childProcessId: Number.MAX_SAFE_INTEGER,
      includeElectronData: false,
    }),
  ).toBe(process.ppid)
})

test('getMainProcessId - remote falls back when the parent process id is invalid', async () => {
  execFile.mockImplementation((_command, _args, callback) => {
    callback(null, { stdout: 'not a process id' })
  })
  expect(
    await ProcessId.getMainProcessId({
      childProcessId: process.pid,
      includeElectronData: false,
    }),
  ).toBe(process.ppid)
})
