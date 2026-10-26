import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-header-row'

export const test: Test = async ({ expect, ProcessExplorer }) => {
  // arrange
  await ProcessExplorer.open()

  // assert
  const headerRow = ProcessExplorer.table().locator(
    '.ProcessExplorerTableHead > tr.ProcessExplorerRow',
  )
  await expect(headerRow).toBeVisible()
  await expect(headerRow).toHaveAttribute('role', 'row')
}
