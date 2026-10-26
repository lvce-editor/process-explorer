import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-header-cells'

export const test: Test = async ({ expect, ProcessExplorer }) => {
  // arrange
  await ProcessExplorer.open()

  // assert
  const headerCells = ProcessExplorer.root().locator('th.ProcessExplorerHeaderCell')
  await expect(headerCells).toHaveCount(3)
}
