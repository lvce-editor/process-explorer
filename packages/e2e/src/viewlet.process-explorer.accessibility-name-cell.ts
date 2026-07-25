import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-name-cell'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')

  // assert
  const nameCell = Locator('td.ProcessExplorerNameCell[data-index="0"]')
  await expect(nameCell).toBeVisible()
  await expect(nameCell).toHaveAttribute('role', 'gridcell')
  await expect(nameCell).toHaveAttribute('tabindex', '-1')
}
