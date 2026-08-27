import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-header-cells'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')

  // assert
  const headerCells = Locator('th.ProcessExplorerHeaderCell')
  await expect(headerCells).toHaveCount(3)
}
