import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.open'

// export const skip = 1

export const test: Test = async ({ ProcessExplorer }) => {
  // act
  await ProcessExplorer.open()

  // assert
  await ProcessExplorer.shouldBeOpen()
  await ProcessExplorer.shouldBeHealthy()
  await ProcessExplorer.shouldHaveHeaders()
}
