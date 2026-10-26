import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-process-row'

export const test: Test = async ({ expect, ProcessExplorer }) => {
  // arrange
  await ProcessExplorer.open()

  // assert
  const firstRow = ProcessExplorer.row(1)
  await expect(firstRow).toBeVisible()
  await expect(firstRow).toHaveAttribute('role', 'row')
  await expect(firstRow).toHaveAttribute('aria-level', '1')
}
