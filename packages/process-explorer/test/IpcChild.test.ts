import { expect, test } from '@jest/globals'
import * as IpcChild from '../src/parts/IpcChild/IpcChild.ts'

test('listen - unexpected ipc type', async () => {
  await expect(
    IpcChild.listen({
      commandMap: {},
      method: 0,
    }),
  ).rejects.toThrow('unexpected ipc type')
})
