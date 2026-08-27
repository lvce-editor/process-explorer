import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-pid-cell'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')

  // assert
  const pidCell = Locator(
    '.ProcessExplorerRow[data-index="0"] > td.ProcessExplorerCell',
  ).nth(1)
  await expect(pidCell).toBeVisible()
  await expect(pidCell).toHaveAttribute('role', 'gridcell')
  await expect(pidCell).toHaveAttribute('data-index', '0')
}
