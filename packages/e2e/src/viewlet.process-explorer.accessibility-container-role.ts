import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-container-role'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')

  // assert
  const processExplorer = Locator('.ProcessExplorer')
  await expect(processExplorer).toBeVisible()
  await expect(processExplorer).toHaveAttribute('role', 'none')
}
