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

const getInspectorWebSocketUrl =
  jest.fn<(pid: number, command: string) => Promise<string>>()

jest.unstable_mockModule(
  '../src/parts/GetInspectorWebSocketUrl/GetInspectorWebSocketUrl.ts',
  () => ({
    getInspectorWebSocketUrl,
  }),
)

const E2eFixtureProcess =
  await import('../src/parts/E2eFixtureProcess/E2eFixtureProcess.ts')

test('createE2eFixtureProcess', async () => {
  const unref = jest.fn()
  getInspectorWebSocketUrl.mockResolvedValue('ws://127.0.0.1:9000')
  // @ts-ignore
  childProcess.spawn.mockImplementation(() => ({
    pid: 123,
    unref,
  }))

  await expect(
    E2eFixtureProcess.createE2eFixtureProcess('test-marker'),
  ).resolves.toBe(123)
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
  expect(getInspectorWebSocketUrl).toHaveBeenCalledWith(123, '--inspect=9000')
})

test('disposeE2eFixtureProcess - marker', async () => {
  const unref = jest.fn()
  const kill = jest.spyOn(process, 'kill').mockImplementation(() => true)
  getInspectorWebSocketUrl.mockResolvedValue('ws://127.0.0.1:9000')
  // @ts-ignore
  childProcess.spawn.mockImplementation(() => ({
    pid: 123,
    unref,
  }))

  try {
    await E2eFixtureProcess.createE2eFixtureProcess('test-marker')
    E2eFixtureProcess.disposeE2eFixtureProcess('test-marker')
    expect(kill).toHaveBeenCalledWith(123, 'SIGTERM')
  } finally {
    kill.mockRestore()
  }
})

test('createE2eFixtureProcess - missing pid', async () => {
  const unref = jest.fn()
  // @ts-ignore
  childProcess.spawn.mockImplementation(() => ({
    pid: undefined,
    unref,
  }))

  await expect(
    E2eFixtureProcess.createE2eFixtureProcess('test-marker'),
  ).rejects.toThrow(new Error('Failed to create e2e fixture process'))
  expect(unref).toHaveBeenCalledTimes(1)
})

test('createE2eFixtureProcess - inspector startup failure', async () => {
  const unref = jest.fn()
  const kill = jest.spyOn(process, 'kill').mockImplementation(() => true)
  getInspectorWebSocketUrl.mockRejectedValue(
    new Error('Could not find the inspector'),
  )
  // @ts-ignore
  childProcess.spawn.mockImplementation(() => ({
    pid: 123,
    unref,
  }))

  try {
    await expect(
      E2eFixtureProcess.createE2eFixtureProcess('test-marker'),
    ).rejects.toThrow(new Error('Could not find the inspector'))
    expect(kill).toHaveBeenCalledWith(123, 'SIGTERM')
  } finally {
    kill.mockRestore()
  }
})
