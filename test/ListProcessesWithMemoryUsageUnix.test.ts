import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('node:child_process', () => ({
  execFile: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/IsMacos/IsMacos.ts', () => ({
  isMacos: true,
}))

jest.unstable_mockModule('node:path', () => ({
  join: (...parts: any[]) => {
    return parts.join('/')
  },
}))

jest.unstable_mockModule('node:fs/promises', () => ({
  readFile: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/CreatePidMap/CreatePidMap.js', () => ({
  createPidMap() {
    return {}
  },
}))

const childProcess = await import('node:child_process')
const fsPromises = await import('node:fs/promises')
const ListProcessesWithMemoryUsage = await import(
  '../src/parts/ListProcessesWithMemoryUsageUnix/ListProcessesWithMemoryUsageUnix.js'
)

class NodeError extends Error {
  code: any
  constructor(code: any, message = code) {
    super(code + ':' + message)
    this.code = code
  }
}

test('listProcessesWithMemoryUsage', async () => {
  // @ts-ignore
  childProcess.execFile.mockImplementation((command, args, callback) => {
    callback(null, {
      stdout: `1       0  0.0  0.1 /sbin/init splash
2127    1442  0.0  0.2 /usr/libexec/gsd-keyboard
2130    1442  0.0  0.2 /usr/libexec/gsd-media-keys
2133    1442  0.0  0.2 /usr/libexec/gsd-power
2134    1442  0.0  0.1 /usr/libexec/gsd-print-notifications
2135    1442  0.0  0.0 /usr/libexec/gsd-rfkill
2136    1442  0.0  0.0 /usr/libexec/gsd-screensaver-proxy
2138    1442  0.0  0.0 /usr/libexec/gsd-sharing
`,
    })
  })
  // @ts-ignore
  fsPromises.readFile.mockImplementation(() => '41700 2023 1199 224 0 5027 0')
  // @ts-ignore
  expect(
    await ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(1442),
  ).toEqual([
    {
      cmd: '/usr/libexec/gsd-keyboard',
      depth: 1,
      memory: 3375104,
      name: '/usr/libexec/gsd-keyboard',
      pid: 2127,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-media-keys',
      depth: 1,
      memory: 3375104,
      name: '/usr/libexec/gsd-media-keys',
      pid: 2130,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-power',
      depth: 1,
      memory: 3375104,
      name: '/usr/libexec/gsd-power',
      pid: 2133,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-print-notifications',
      depth: 1,
      memory: 3375104,
      name: '/usr/libexec/gsd-print-notifications',
      pid: 2134,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-rfkill',
      depth: 1,
      memory: 3375104,
      name: '/usr/libexec/gsd-rfkill',
      pid: 2135,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-screensaver-proxy',
      depth: 1,
      memory: 3375104,
      name: '/usr/libexec/gsd-screensaver-proxy',
      pid: 2136,
      ppid: 1442,
    },
    {
      cmd: '/usr/libexec/gsd-sharing',
      depth: 1,
      memory: 3375104,
      name: '/usr/libexec/gsd-sharing',
      pid: 2138,
      ppid: 1442,
    },
  ])
})

test('listProcessesWithMemoryUsage - bug with parsing this specific line', async () => {
  // @ts-ignore
  childProcess.execFile.mockImplementation((command, args, callback) => {
    callback(null, {
      stdout:
        ' 25666   24775  131  1.4 /snap/code/97/usr/share/code/code --ms-enable-electron-run-as-node --max-old-space-size=3072 /snap/code/97/usr/share/code/resources/app/extensions/node_modules/typescript/lib/tsserver.js --useInferredProjectPerProjectRoot --disableAutomaticTypingAcquisition --enableTelemetry --cancellationPipeName /tmp/vscode-typescript1000/25df66cb1c287c2f519c/tscancellation-9462d6e60479e4eb5d2f.tmp* --locale en --noGetErrOnBackgroundUpdate --validateDefaultNpmLocation --useNodeIpc',
    })
  })
  // @ts-ignore
  fsPromises.readFile.mockImplementation(() => '41700 2023 1199 224 0 5027 0')
  // @ts-ignore
  expect(
    await ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(25666),
  ).toEqual([
    {
      cmd: '/snap/code/97/usr/share/code/code --ms-enable-electron-run-as-node --max-old-space-size=3072 /snap/code/97/usr/share/code/resources/app/extensions/node_modules/typescript/lib/tsserver.js --useInferredProjectPerProjectRoot --disableAutomaticTypingAcquisition --enableTelemetry --cancellationPipeName /tmp/vscode-typescript1000/25df66cb1c287c2f519c/tscancellation-9462d6e60479e4eb5d2f.tmp* --locale en --noGetErrOnBackgroundUpdate --validateDefaultNpmLocation --useNodeIpc',
      depth: 1,
      memory: 3375104,
      name: 'main',
      pid: 25666,
      ppid: 24775,
    },
  ])
})

test('listProcessesWithMemoryUsage - error - line could not be parsed', async () => {
  // @ts-ignore
  childProcess.execFile.mockImplementation((command, args, callback) => {
    callback(null, { stdout: 'abc' })
  })
  await expect(
    ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(1),
  ).rejects.toThrow(new Error('line could not be parsed: abc'))
})

test('listProcessesWithMemoryUsage - detect chrome devtools', async () => {
  // @ts-ignore
  childProcess.execFile.mockImplementation((command, args, callback) => {
    callback(null, {
      stdout:
        ' 25666   24775  131  1.4 /snap/code/97/usr/share/code/code --ms-enable-electron-run-as-node --max-old-space-size=3072 /snap/code/97/usr/share/code/resources/app/extensions/node_modules/typescript/lib/tsserver.js --useInferredProjectPerProjectRoot --disableAutomaticTypingAcquisition --enableTelemetry --cancellationPipeName /tmp/vscode-typescript1000/25df66cb1c287c2f519c/tscancellation-9462d6e60479e4eb5d2f.tmp* --locale en --noGetErrOnBackgroundUpdate --validateDefaultNpmLocation --useNodeIpc',
    })
  })
  // @ts-ignore
  fsPromises.readFile.mockImplementation(() => '41700 2023 1199 224 0 5027 0')
  // @ts-ignore
  expect(
    await ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(25666),
  ).toEqual([
    {
      cmd: '/snap/code/97/usr/share/code/code --ms-enable-electron-run-as-node --max-old-space-size=3072 /snap/code/97/usr/share/code/resources/app/extensions/node_modules/typescript/lib/tsserver.js --useInferredProjectPerProjectRoot --disableAutomaticTypingAcquisition --enableTelemetry --cancellationPipeName /tmp/vscode-typescript1000/25df66cb1c287c2f519c/tscancellation-9462d6e60479e4eb5d2f.tmp* --locale en --noGetErrOnBackgroundUpdate --validateDefaultNpmLocation --useNodeIpc',
      depth: 1,
      memory: 3375104,
      name: 'main',
      pid: 25666,
      ppid: 24775,
    },
  ])
})

test('listProcessesWithMemoryUsage - error - ESRCH', async () => {
  // @ts-ignore
  childProcess.execFile.mockImplementation((command, args, callback) => {
    callback(null, {
      stdout: `1       0  0.0  0.1 /sbin/init splash
2127    1442  0.0  0.2 /usr/libexec/gsd-keyboard
2130    1442  0.0  0.2 /usr/libexec/gsd-media-keys
`,
    })
  })
  // @ts-ignore
  fsPromises.readFile.mockImplementation((path) => {
    switch (path) {
      case '/proc/2127/statm':
        throw new NodeError(ErrorCodes.ESRCH, 'no such process, read')
      default:
        return '41700 2023 1199 224 0 5027 0'
    }
  })
  expect(
    await ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(1442),
  ).toEqual([
    {
      cmd: '/usr/libexec/gsd-media-keys',
      depth: 1,
      memory: 3375104,
      name: '/usr/libexec/gsd-media-keys',
      pid: 2130,
      ppid: 1442,
    },
  ])
})
