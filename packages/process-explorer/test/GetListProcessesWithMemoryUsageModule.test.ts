import { expect, test } from '@jest/globals'
import * as GetListProcessesWithMemoryUsageModule from '../src/parts/GetListProcessesWithMemoryUsageModule/GetListProcessesWithMemoryUsageModule.ts'

test('loads the process enumeration module for the current platform', async () => {
  const module = await GetListProcessesWithMemoryUsageModule.getModule()

  expect(module.listProcessesWithMemoryUsage).toEqual(expect.any(Function))
})
