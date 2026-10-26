import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-table-head'

export const test: Test = async ({ expect, Locator, ProcessExplorer }) => {
  // arrange
  await ProcessExplorer.open()

  // assert
  const tableHead = Locator('thead.ProcessExplorerTableHead')
  await expect(tableHead).toBeVisible()
  await expect(tableHead).toHaveAttribute('role', 'rowgroup')
}
