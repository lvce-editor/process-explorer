import { expect, jest, test } from '@jest/globals'

const kill = jest.fn()

jest.unstable_mockModule('../src/parts/Process/Process.ts', () => ({
  kill,
}))

const KillProcess = await import(
  '../src/parts/KillProcess/KillProcess.ts'
)

test('killProcess', () => {
  KillProcess.killProcess(123)

  expect(kill).toHaveBeenCalledWith(123, 'SIGTERM')
})
