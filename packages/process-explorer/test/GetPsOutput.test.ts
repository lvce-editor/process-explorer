import { expect, jest, test } from '@jest/globals'

type ExecFileCallback = (
  error: (Error & { readonly signal?: string }) | null,
  result?: { readonly stdout: string },
) => void

const execFile = jest.fn(
  (_command: string, _args: readonly string[], callback: ExecFileCallback) => {
    callback(null, { stdout: '  process list  \n' })
  },
)

// The subprocess must be mocked to deterministically cover SIGINT and failure handling.
// eslint-disable-next-line jest/no-restricted-jest-methods
jest.unstable_mockModule('node:child_process', () => ({ execFile }))

const GetPsOutput = await import('../src/parts/GetPsOutput/GetPsOutput.ts')

test('getPsOutput trims process list output', async () => {
  await expect(GetPsOutput.getPsOutput()).resolves.toBe('process list')
})

test('getPsOutput returns an empty list when interrupted', async () => {
  execFile.mockImplementation((_command, _args, callback) => {
    callback(Object.assign(new Error('interrupted'), { signal: 'SIGINT' }))
  })

  await expect(GetPsOutput.getPsOutput()).resolves.toBe('')
})

test('getPsOutput wraps command failures', async () => {
  execFile.mockImplementation((_command, _args, callback) => {
    callback(new Error('ps failed'))
  })

  await expect(GetPsOutput.getPsOutput()).rejects.toThrow(
    'Failed to execute ps',
  )
})
