import { expect, jest, test } from '@jest/globals'
import * as KillProcess from '../src/parts/KillProcess/KillProcess.ts'

test('killProcess', () => {
  const kill = jest.spyOn(process, 'kill').mockImplementation(() => true)

  try {
    KillProcess.killProcess(123)
    expect(kill).toHaveBeenCalledWith(123, 'SIGTERM')
  } finally {
    kill.mockRestore()
  }
})
