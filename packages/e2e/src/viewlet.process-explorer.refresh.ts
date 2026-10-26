import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.refresh'

export const test: Test = async ({ ProcessExplorer }) => {
  // arrange
  await ProcessExplorer.open()

  // act
  await ProcessExplorer.refresh()

  // assert
  await ProcessExplorer.shouldBeHealthy()
}
