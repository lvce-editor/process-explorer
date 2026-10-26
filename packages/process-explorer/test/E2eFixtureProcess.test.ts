import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.clearAllMocks()
})

jest.unstable_mockModule('node:child_process', () => ({
  spawn: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const childProcess = await import('node:child_process')
const E2eFixtureProcess =
  await import('../src/parts/E2eFixtureProcess/E2eFixtureProcess.ts')

test('createE2eFixtureProcess', () => {
  const unref = jest.fn()
  // @ts-ignore
  childProcess.spawn.mockImplementation(() => ({
    pid: 123,
    unref,
  }))

  expect(E2eFixtureProcess.createE2eFixtureProcess('test-marker')).toBe(123)
  expect(childProcess.spawn).toHaveBeenCalledWith(
    process.execPath,
    ['--inspect=9000', '-e', expect.any(String), 'test-marker'],
    expect.objectContaining({
      env: expect.objectContaining({
        ELECTRON_RUN_AS_NODE: '1',
      }),
      shell: false,
      stdio: 'ignore',
    }),
  )
  expect(unref).toHaveBeenCalledTimes(1)
})

test('disposeE2eFixtureProcess - marker', () => {
  const unref = jest.fn()
  const kill = jest.spyOn(process, 'kill').mockImplementation(() => true)
  // @ts-ignore
  childProcess.spawn.mockImplementation(() => ({
    pid: 123,
    unref,
  }))

  try {
    E2eFixtureProcess.createE2eFixtureProcess('test-marker')
    E2eFixtureProcess.disposeE2eFixtureProcess('test-marker')
    expect(kill).toHaveBeenCalledWith(123, 'SIGTERM')
  } finally {
    kill.mockRestore()
  }
})

test('createE2eFixtureProcess - missing pid', () => {
  const unref = jest.fn()
  // @ts-ignore
  childProcess.spawn.mockImplementation(() => ({
    pid: undefined,
    unref,
  }))

  expect(() =>
    E2eFixtureProcess.createE2eFixtureProcess('test-marker'),
  ).toThrow(new Error('Failed to create e2e fixture process'))
  expect(unref).toHaveBeenCalledTimes(1)
})

test('disposeE2eFixtureProcess - ignores unknown markers', () => {
  const kill = jest.spyOn(process, 'kill')

  E2eFixtureProcess.disposeE2eFixtureProcess('unknown-marker')

  expect(kill).not.toHaveBeenCalled()
  kill.mockRestore()
})

test('disposeE2eFixtureProcess - ignores a zero pid', () => {
  const kill = jest.spyOn(process, 'kill')

  E2eFixtureProcess.disposeE2eFixtureProcess(0)

  expect(kill).not.toHaveBeenCalled()
  kill.mockRestore()
})

test('disposeE2eFixtureProcess - accepts a numeric pid', () => {
  const kill = jest.spyOn(process, 'kill').mockImplementation(() => true)

  E2eFixtureProcess.disposeE2eFixtureProcess(123)

  expect(kill).toHaveBeenCalledWith(123, 'SIGTERM')
  kill.mockRestore()
})

test('disposeE2eFixtureProcess - removes the marker when killing fails', () => {
  const unref = jest.fn()
  const kill = jest.spyOn(process, 'kill').mockImplementation(() => {
    throw new Error('process already exited')
  })
  // @ts-ignore
  childProcess.spawn.mockImplementation(() => ({
    pid: 123,
    unref,
  }))

  E2eFixtureProcess.createE2eFixtureProcess('exited-marker')
  E2eFixtureProcess.disposeE2eFixtureProcess('exited-marker')
  E2eFixtureProcess.disposeE2eFixtureProcess('exited-marker')

  expect(kill).toHaveBeenCalledTimes(1)
  kill.mockRestore()
})
