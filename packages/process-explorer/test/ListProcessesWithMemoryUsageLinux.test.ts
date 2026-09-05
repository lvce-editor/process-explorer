import { beforeEach, expect, jest, test } from '@jest/globals'
import { readFileSync as actualReadFileSync } from 'node:fs'

beforeEach(() => {
  jest.clearAllMocks()
})

jest.unstable_mockModule('node:fs', () => ({
  readdirSync: jest.fn(() => ['10', '20', '30', 'self']),
  readFileSync: jest.fn(actualReadFileSync),
}))

jest.unstable_mockModule('node:path', () => ({
  join: (...parts: readonly string[]): string => parts.join('/'),
}))

const fs = await import('node:fs')
const ListProcessesWithMemoryUsage =
  await import('../src/parts/ListProcessesWithMemoryUsageLinux/ListProcessesWithMemoryUsageLinux.ts')

class NodeError extends Error {
  code: string

  constructor(code: string) {
    super(code)
    this.code = code
  }
}

const createStat = (
  pid: number,
  command: string,
  ppid: number,
  residentPages: number,
): string => {
  const fields = ['S', String(ppid)]
  for (let index = 0; index < 19; index++) {
    fields.push('0')
  }
  fields.push(String(residentPages))
  return `${pid} (${command}) ${fields.join(' ')}`
}

test('listProcessesWithMemoryUsage - reads command lines only for the selected tree', async () => {
  // @ts-ignore
  fs.readFileSync.mockImplementation((path: string) => {
    const files: Record<string, string> = {
      '/proc/10/cmdline': 'electron\0.\0',
      '/proc/10/smaps_rollup': 'Rss: 100 kB\nPss: 50 kB\n',
      '/proc/10/stat': createStat(10, 'electron', 1, 100),
      '/proc/20/cmdline': 'node\0worker.js\0',
      '/proc/20/smaps_rollup': 'Rss: 200 kB\nPss: 75 kB\n',
      '/proc/20/stat': createStat(20, 'node', 10, 200),
      '/proc/30/cmdline': 'unrelated\0',
      '/proc/30/stat': createStat(30, 'unrelated', 1, 300),
    }
    return files[path]
  })

  await expect(
    ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(10, {
      20: 'shared-process',
    }),
  ).resolves.toEqual([
    {
      cmd: 'electron .',
      depth: 1,
      memory: 51_200,
      name: 'main',
      pid: 10,
      ppid: 1,
    },
    {
      cmd: 'node worker.js',
      depth: 2,
      memory: 76_800,
      name: 'shared-process',
      pid: 20,
      ppid: 10,
    },
  ])
  expect(fs.readFileSync).not.toHaveBeenCalledWith('/proc/30/cmdline', 'utf8')
  expect(fs.readFileSync).not.toHaveBeenCalledWith(
    '/proc/30/smaps_rollup',
    'utf8',
  )
})

test('listProcessesWithMemoryUsage - uses the process name when cmdline is empty', async () => {
  // @ts-ignore
  fs.readdirSync.mockReturnValue(['20'])
  // @ts-ignore
  fs.readFileSync.mockImplementation((path: string) => {
    if (path.endsWith('/stat')) {
      return createStat(20, 'kernel worker', 10, 200)
    }
    return ''
  })

  await expect(
    ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(10, {}),
  ).resolves.toEqual([
    {
      cmd: 'kernel worker',
      depth: 1,
      memory: 819_200,
      name: 'kernel worker',
      pid: 20,
      ppid: 10,
    },
  ])
})

test('listProcessesWithMemoryUsage - falls back to RSS when PSS is unavailable', async () => {
  // @ts-ignore
  fs.readdirSync.mockReturnValue(['10'])
  // @ts-ignore
  fs.readFileSync.mockImplementation((path: string) => {
    if (path.endsWith('/stat')) {
      return createStat(10, 'main', 1, 100)
    }
    if (path.endsWith('/cmdline')) {
      return 'main\0'
    }
    throw new NodeError('EACCES')
  })

  await expect(
    ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(10, {}),
  ).resolves.toEqual([
    {
      cmd: 'main',
      depth: 1,
      memory: 409_600,
      name: 'main',
      pid: 10,
      ppid: 1,
    },
  ])
})

test('listProcessesWithMemoryUsage - ignores a process that exits while reading stat', async () => {
  // @ts-ignore
  fs.readdirSync.mockReturnValue(['10', '20'])
  // @ts-ignore
  fs.readFileSync.mockImplementation((path: string) => {
    if (path === '/proc/10/stat') {
      return createStat(10, 'main', 1, 100)
    }
    if (path === '/proc/10/cmdline') {
      return 'main\0'
    }
    throw new NodeError('ENOENT')
  })

  await expect(
    ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(10, {}),
  ).resolves.toHaveLength(1)
})

test('listProcessesWithMemoryUsage - ignores a process that exits while reading cmdline', async () => {
  // @ts-ignore
  fs.readdirSync.mockReturnValue(['10'])
  // @ts-ignore
  fs.readFileSync.mockImplementation((path: string) => {
    if (path.endsWith('/stat')) {
      return createStat(10, 'main', 1, 100)
    }
    throw new NodeError('ESRCH')
  })

  await expect(
    ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(10, {}),
  ).resolves.toEqual([])
})

test('listProcessesWithMemoryUsage - rejects an invalid stat file', async () => {
  // @ts-ignore
  fs.readdirSync.mockReturnValue(['10'])
  // @ts-ignore
  fs.readFileSync.mockReturnValue('invalid')

  await expect(
    ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(10, {}),
  ).rejects.toThrow('Invalid process stat')
})
