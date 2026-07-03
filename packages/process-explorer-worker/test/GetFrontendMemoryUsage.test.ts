import { afterEach, expect, jest, test } from '@jest/globals'
import * as GetFrontendMemoryUsage from '../src/parts/GetFrontendMemoryUsage/GetFrontendMemoryUsage.ts'

const originalPerformance = globalThis.performance

const setPerformance = (performance: unknown): void => {
  Object.defineProperty(globalThis, 'performance', {
    configurable: true,
    value: performance,
  })
}

afterEach(() => {
  setPerformance(originalPerformance)
})

test('getFrontendMemoryUsage - missing memory api', async () => {
  setPerformance({})

  await expect(
    GetFrontendMemoryUsage.getFrontendMemoryUsage(1),
  ).resolves.toEqual([])
})

test('getFrontendMemoryUsage - invalid memory api', async () => {
  setPerformance({
    measureUserAgentSpecificMemory: 1,
  })

  await expect(
    GetFrontendMemoryUsage.getFrontendMemoryUsage(1),
  ).resolves.toEqual([])
})

test('getFrontendMemoryUsage - measurement rejects', async () => {
  setPerformance({
    measureUserAgentSpecificMemory: jest.fn(async () => {
      throw new Error('not available')
    }),
  })

  await expect(
    GetFrontendMemoryUsage.getFrontendMemoryUsage(1),
  ).resolves.toEqual([])
})

test.each([undefined, '100', NaN, -1])(
  'getFrontendMemoryUsage - invalid total bytes %#',
  async (bytes) => {
    setPerformance({
      measureUserAgentSpecificMemory: jest.fn(async () => ({
        bytes,
      })),
    })

    await expect(
      GetFrontendMemoryUsage.getFrontendMemoryUsage(1),
    ).resolves.toEqual([])
  },
)

test('getFrontendMemoryUsage - window process without breakdown', async () => {
  const measureUserAgentSpecificMemory = jest.fn(async () => ({
    bytes: 100,
  }))
  setPerformance({
    measureUserAgentSpecificMemory,
  })

  await expect(
    GetFrontendMemoryUsage.getFrontendMemoryUsage(1),
  ).resolves.toEqual([
    {
      cmd: 'window',
      memory: 100,
      name: 'window',
      pid: -1,
      ppid: 1,
      synthetic: true,
    },
  ])
  expect(measureUserAgentSpecificMemory.mock.contexts[0]).toBe(
    globalThis.performance,
  )
})

test('getFrontendMemoryUsage - breakdown names and filters entries', async () => {
  setPerformance({
    measureUserAgentSpecificMemory: jest.fn(async () => ({
      breakdown: [
        {
          attribution: [
            {
              scope: 'script',
              url: 'https://example.com/path/app.js?version=1',
            },
          ],
          bytes: 90,
        },
        {
          attribution: [
            {
              scope: 'document',
              url: 'https://example.com/',
            },
          ],
          bytes: 80,
        },
        {
          attribution: [
            {
              scope: 'worker',
              url: 'not/a/real/url?query=1',
            },
          ],
          bytes: 70,
        },
        {
          attribution: [
            {
              scope: 'unknown',
              url: '?',
            },
          ],
          bytes: 60,
        },
        {
          attribution: [
            {
              url: 'cross-origin-url',
            },
          ],
          bytes: 50,
        },
        {
          attribution: [
            {
              scope: 'detached',
            },
          ],
          bytes: 40,
        },
        {
          bytes: 30,
          types: ['DOM', 'JS'],
        },
        {
          bytes: 20,
          types: [],
        },
        {
          attribution: [],
          bytes: 0,
          types: ['ignored zero'],
        },
        {
          bytes: -1,
          types: ['ignored negative'],
        },
        {
          bytes: NaN,
          types: ['ignored nan'],
        },
        {
          bytes: '10',
          types: ['ignored string'],
        },
      ],
      bytes: 500,
    })),
  })

  await expect(
    GetFrontendMemoryUsage.getFrontendMemoryUsage(1),
  ).resolves.toEqual([
    expect.objectContaining({
      memory: 500,
      name: 'window',
      pid: -1,
    }),
    expect.objectContaining({
      memory: 90,
      name: 'script: app.js',
      pid: -2,
      ppid: -1,
    }),
    expect.objectContaining({
      memory: 80,
      name: 'document: example.com',
      pid: -3,
    }),
    expect.objectContaining({
      memory: 70,
      name: 'worker: url',
      pid: -4,
    }),
    expect.objectContaining({
      memory: 60,
      name: 'unknown: ?',
      pid: -5,
    }),
    expect.objectContaining({
      memory: 50,
      name: 'memory: cross-origin-url',
      pid: -6,
    }),
    expect.objectContaining({
      memory: 40,
      name: 'detached',
      pid: -7,
    }),
    expect.objectContaining({
      memory: 30,
      name: 'DOM, JS',
      pid: -8,
    }),
    expect.objectContaining({
      memory: 20,
      name: 'breakdown 8',
      pid: -9,
    }),
  ])
})
