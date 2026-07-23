import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.node-process-killed'

export const test: Test = async ({ Command, ContextMenu, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')
  const processExplorerProcess = Locator(
    '.ProcessExplorerRow[title*="processExplorerMain.ts"]',
  )
  await expect(processExplorerProcess).toBeVisible()

  // act
  // eslint-disable-next-line e2e/no-direct-click -- focuses the exact process explorer node process
  await processExplorerProcess.click()
  await Command.execute('ProcessExplorer.handleContextMenu')
  const killProcess = Locator('.MenuItem', { hasText: 'Kill Process' })
  await expect(killProcess).toBeVisible()
  await ContextMenu.selectItem('Kill Process')

  // assert
  const error = Locator('.ProcessExplorerError')
  const table = Locator('.ProcessExplorerTable')
  await expect(error).toBeVisible()
  await expect(table).toBeHidden()
  await expect(error).toContainText(
    'Process explorer RPC connection was closed',
  )
}
