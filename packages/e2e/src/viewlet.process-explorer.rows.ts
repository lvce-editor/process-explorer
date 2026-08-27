import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.rows'

export const test: Test = async ({ Command, expect, Locator }) => {
  // act
  await Command.execute('Developer.openProcessExplorer')

  // assert
  const row = Locator('.ProcessExplorerRow').nth(1)
  const nameCell = row.locator('.ProcessExplorerNameCell')
  const pidCell = row.locator('.ProcessExplorerCell').nth(1)
  const memoryCell = row.locator('.ProcessExplorerCell').nth(2)
  await expect(row).toBeVisible()
  await expect(nameCell).toBeVisible()
  await expect(pidCell).toBeVisible()
  await expect(memoryCell).toBeVisible()
}
