import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.open'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  // act
  await Command.execute('Developer.openProcessExplorer')

  // assert
  const processExplorer = Locator('.ProcessExplorer')
  const processExplorerGrid = Locator('[aria-label="Process Explorer"]')
  const processExplorerError = processExplorer.locator('.ProcessExplorerError')
  const nameHeader = processExplorer
    .locator('.ProcessExplorerHeaderCell')
    .nth(0)
  const pidHeader = processExplorer.locator('.ProcessExplorerHeaderCell').nth(1)
  const memoryHeader = processExplorer
    .locator('.ProcessExplorerHeaderCell')
    .nth(2)
  await expect(processExplorer).toBeVisible()
  await expect(processExplorerError).not.toBeVisible()
  await expect(processExplorerGrid).toBeVisible()
  await expect(nameHeader).toHaveText('Name')
  await expect(pidHeader).toHaveText('PID')
  await expect(memoryHeader).toHaveText('Memory')
}
