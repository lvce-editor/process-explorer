import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.rows'

export const test: Test = async ({ ProcessExplorer }) => {
  // act
  await ProcessExplorer.open()

  // assert
  await ProcessExplorer.shouldHaveRow(1)
}
