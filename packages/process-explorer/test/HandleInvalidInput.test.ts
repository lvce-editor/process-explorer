import { expect, test } from '@jest/globals'
import * as HandleElectronMessagePort from '../src/parts/HandleElectronMessagePort/HandleElectronMessagePort.ts'
import * as HandleMessagePort from '../src/parts/HandleMessagePort/HandleMessagePort.ts'
import * as HandleSocket from '../src/parts/HandleSocket/HandleSocket.ts'

test('handleElectronMessagePort - invalid message port', async () => {
  await expect(
    HandleElectronMessagePort.handleElectronMessagePort(undefined),
  ).rejects.toThrow()
})

test('handleMessagePort - invalid message port', async () => {
  await expect(HandleMessagePort.handleMessagePort(undefined)).rejects.toThrow()
})

test('handleSocket - invalid websocket', async () => {
  await expect(HandleSocket.handleSocket(undefined)).rejects.toThrow()
})
