import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-name-cell'

export const test: Test = async ({ expect, ProcessExplorer }) => {
  // arrange
  await ProcessExplorer.open()

  // assert
  const nameCell = ProcessExplorer.nameCell(1)
  await expect(nameCell).toBeVisible()
  await expect(nameCell).toHaveAttribute('role', 'gridcell')
  await expect(nameCell).toHaveAttribute('tabindex', '-1')
}
