import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-row-count'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')

  // assert
  const gridWithRowCount = Locator('.ProcessExplorerTable[aria-rowcount]')
  await expect(gridWithRowCount).toBeVisible()
}
