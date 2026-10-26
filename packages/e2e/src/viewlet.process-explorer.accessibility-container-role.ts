import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-container-role'

export const test: Test = async ({ expect, ProcessExplorer }) => {
  // arrange
  await ProcessExplorer.open()

  // assert
  const processExplorer = ProcessExplorer.root()
  await expect(processExplorer).toBeVisible()
  await expect(processExplorer).toHaveAttribute('role', 'none')
}
