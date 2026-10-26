import { expect, test } from '@jest/globals'
import { readFile } from 'node:fs/promises'

test('contributes the Process Explorer update interval setting', async () => {
  const settingsUrl = new URL('../settings.json', import.meta.url)
  const settings = JSON.parse(await readFile(settingsUrl, 'utf8'))

  expect(settings).toEqual([
    {
      category: 'workbench',
      description:
        'Controls how often the Process Explorer refreshes, in milliseconds',
      heading: 'Process Explorer Update Interval',
      id: 'processExplorer.updateInterval',
      maximum: 5000,
      minimum: 500,
      type: 'number',
      value: 1000,
    },
  ])
})
