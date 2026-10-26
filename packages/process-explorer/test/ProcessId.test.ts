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

test.each(['', '0', '-1', 'not-a-pid', 'Infinity'])(
  'getMainProcessId - remote falls back when parent lookup returns %j',
  async (stdout) => {
    execFile.mockImplementation((_command, _args, callback) => {
      callback(null, { stdout })
    })
    expect(
      await ProcessId.getMainProcessId({ includeElectronData: false }),
    ).toBe(process.ppid)
  },
)

test('getMainProcessId - remote uses its own root instead of the local parent', async () => {
  const remoteRootPid = process.ppid + 100
  execFile.mockImplementation((_command, _args, callback) => {
    callback(null, { stdout: `  ${remoteRootPid}\n` })
  })
  expect(
    await ProcessId.getMainProcessId({
      childProcessId: 42,
      includeElectronData: false,
    }),
  ).toBe(remoteRootPid)
  expect(execFile).toHaveBeenCalledWith(
    process.platform === 'win32' ? 'powershell.exe' : 'ps',
    process.platform === 'win32'
      ? [
          '-NoProfile',
          '-Command',
          '(Get-CimInstance Win32_Process -Filter "ProcessId = 42").ParentProcessId',
        ]
      : ['-o', 'ppid=', '-p', '42'],
    expect.any(Function),
  )
})
