import { expect, test } from '@jest/globals'
import * as GetLinuxProcessListeningPorts from '../src/parts/GetLinuxProcessListeningPorts/GetLinuxProcessListeningPorts.ts'

const header =
  '  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode'

test('parseProcNetTcp returns listening ports owned by the process', () => {
  const content = `${header}\n   0: 0100007F:2405 00000000:0000 0A 00000000:00000000 00:00000000 00000000  1000 0 12345 1\n   1: 0100007F:1F90 00000000:0000 0A 00000000:00000000 00:00000000 00000000  1000 0 67890 1\n`

  expect(
    GetLinuxProcessListeningPorts.parseProcNetTcp(content, new Set(['12345'])),
  ).toEqual([9221])
})

test('parseProcNetTcp ignores non-listening and malformed rows', () => {
  const content = `${header}\ninvalid\n   0: 0100007F:2405 00000000:0000 01 00000000:00000000 00:00000000 00000000  1000 0 12345 1\n`

  expect(
    GetLinuxProcessListeningPorts.parseProcNetTcp(content, new Set(['12345'])),
  ).toEqual([])
})

test('getLinuxProcessListeningPorts returns an empty list when procfs is unavailable', async () => {
  await expect(
    GetLinuxProcessListeningPorts.getLinuxProcessListeningPorts(-1),
  ).resolves.toEqual([])
})

test('reads listening ports for the current process', async () => {
  await expect(
    GetLinuxProcessListeningPorts.getLinuxProcessListeningPorts(process.pid),
  ).resolves.toEqual(expect.any(Array))
})
