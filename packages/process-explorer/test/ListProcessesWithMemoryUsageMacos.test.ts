import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.clearAllMocks()
})

jest.unstable_mockModule('node:child_process', () => ({
  execFile: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/IsMacos/IsMacos.ts', () => ({
  isMacOs: true,
}))

const createPidMap = jest.fn((): Record<string, never> => {
  return {}
})

jest.unstable_mockModule('../src/parts/CreatePidMap/CreatePidMap.js', () => ({
  createPidMap,
}))

const childProcess = await import('node:child_process')
const ListProcessesWithMemoryUsage =
  await import('../src/parts/ListProcessesWithMemoryUsageUnix/ListProcessesWithMemoryUsageUnix.js')

test('listProcessesWithMemoryUsage - uses ps resident memory on macOS', async () => {
  // @ts-ignore
  childProcess.execFile.mockImplementation((command, args, callback) => {
    callback(null, {
      stdout: `100 1 0.0 2048 Electron
101 100 0.0 4096 Electron Helper --type=renderer`,
    })
  })

  await expect(
    ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(100),
  ).resolves.toEqual([
    {
      cmd: 'Electron',
      depth: 1,
      memory: 2_097_152,
      name: 'main',
      pid: 100,
      ppid: 1,
    },
    {
      cmd: 'Electron Helper --type=renderer',
      depth: 2,
      memory: 4_194_304,
      name: 'renderer',
      pid: 101,
      ppid: 100,
    },
  ])
  expect(childProcess.execFile).toHaveBeenCalledWith(
    'ps',
    ['-ax', '-o', 'pid=,ppid=,pcpu=,rss=,command='],
    expect.any(Function),
  )
})
