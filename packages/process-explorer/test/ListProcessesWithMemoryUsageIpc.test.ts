import { expect, test } from '@jest/globals'
import * as ListProcessesWithMemoryUsage from '../src/parts/ListProcessesWithMemoryUsage/ListProcessesWithMemoryUsage.ts'
import * as ListProcessesWithMemoryUsageIpc from '../src/parts/ListProcessesWithMemoryUsage/ListProcessesWithMemoryUsage.ipc.ts'

test('name', () => {
  expect(ListProcessesWithMemoryUsageIpc.name).toBe(
    'ListProcessesWithMemoryUsage',
  )
})

test('Commands', () => {
  expect(
    ListProcessesWithMemoryUsageIpc.Commands.listProcessesWithMemoryUsage,
  ).toBe(ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage)
})
