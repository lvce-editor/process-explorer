import { expect, test } from '@jest/globals'
import * as GetProcessListeningPorts from '../src/parts/GetProcessListeningPorts/GetProcessListeningPorts.ts'

test('returns no ports on non-Linux platforms', async () => {
  const { platform } = process
  Object.defineProperty(process, 'platform', {
    configurable: true,
    value: 'win32',
  })

  try {
    await expect(
      GetProcessListeningPorts.getProcessListeningPorts(1),
    ).resolves.toEqual([])
  } finally {
    Object.defineProperty(process, 'platform', {
      configurable: true,
      value: platform,
    })
  }
})
