import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.node-process-killed'

const contextMenuEventInit = {
  bubbles: true,
  button: 2,
  clientX: 10,
  clientY: 10,
} as unknown as string

export const test: Test = async ({ Command, ContextMenu, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')
  const processExplorerProcess = Locator(
    '.ProcessExplorerRow[title*="processExplorerMain.ts"]',
  )
  await expect(processExplorerProcess).toBeVisible()

  // act
  await processExplorerProcess.dispatchEvent(
    'contextmenu',
    contextMenuEventInit,
  )
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
