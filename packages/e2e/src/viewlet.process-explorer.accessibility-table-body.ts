import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-table-body'

export const test: Test = async ({ expect, Locator, ProcessExplorer }) => {
  // arrange
  await ProcessExplorer.open()

  // assert
  const tableBody = Locator('tbody.ProcessExplorerTableBody')
  await expect(tableBody).toBeVisible()
  await expect(tableBody).toHaveAttribute('role', 'rowgroup')
}
