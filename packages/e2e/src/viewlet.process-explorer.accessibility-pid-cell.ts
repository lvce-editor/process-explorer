import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-pid-cell'

export const test: Test = async ({ expect, ProcessExplorer }) => {
  // arrange
  await ProcessExplorer.open()

  // assert
  const pidCell = ProcessExplorer.pidCell(1)
  await expect(pidCell).toBeVisible()
  await expect(pidCell).toHaveAttribute('role', 'gridcell')
  await expect(pidCell).toHaveAttribute('data-index', '0')
}
