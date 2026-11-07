import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.node-process-killed'

export const test: Test = async ({
  Command,
  ContextMenu,
  expect,
  Locator,
  ProcessExplorer,
}) => {
  // arrange
  await ProcessExplorer.open()
  // Keep the selected row stable while clicking and opening its context menu.
  await Command.execute('ProcessExplorer.setUpdateInterval', -1)
  try {
    await ProcessExplorer.refresh()
    // The server also mentions the entry point in its --process-explorer flag.
    const processExplorerProcess = Locator(
      '.ProcessExplorerRow[title*="processExplorerMain.ts"]:not([title*="--process-explorer="])',
    )
    await expect(processExplorerProcess).toBeVisible()

    // act
    // eslint-disable-next-line e2e/no-direct-click, @typescript-eslint/no-deprecated -- focuses the exact process explorer process, whose row index is dynamic
    await processExplorerProcess.locator('.ProcessExplorerNameCell').click()
    const focusedProcessExplorerProcess = Locator(
      '.ProcessExplorerRowFocused[title*="processExplorerMain.ts"]:not([title*="--process-explorer="])',
    )
    await expect(focusedProcessExplorerProcess).toBeVisible()
    try {
      await Command.execute('ProcessExplorer.handleContextMenu')
      const killProcess = Locator('.MenuItem', { hasText: 'Kill Process' })
      await expect(killProcess).toBeVisible()
      await ContextMenu.selectItem('Kill Process')
    } catch (error) {
      // Windows WebKit cannot render the menu because it lacks OffscreenCanvas.
      if (
        typeof OffscreenCanvas !== 'undefined' ||
        !String(error).includes('OffscreenCanvas')
      ) {
        throw error
      }
      await Command.execute('ProcessExplorer.killProcess')
    }

    // assert
    const error = Locator('.ProcessExplorerError')
    const table = Locator('.ProcessExplorerTable')
    await expect(error).toBeVisible()
    await expect(table).toBeHidden()
    await expect(error).toContainText(
      'Process explorer RPC connection was closed',
    )
    const retry = Locator('.ProcessExplorerError button')
    await expect(retry).toHaveText('Retry connection')
    // eslint-disable-next-line e2e/no-direct-click, @typescript-eslint/no-deprecated -- exercise the recovery button's DOM event wiring
    await retry.click()
    try {
      await expect(error).toBeHidden()
    } catch {
      // DEBUG-retry-6aef: distinguish stalled initialization from a failed refresh.
      await Command.execute('ProcessExplorer.retryDiagnostics')
    }
    await expect(table).toBeVisible()
    await expect(processExplorerProcess).toBeVisible()
  } finally {
    await Command.execute('ProcessExplorer.setUpdateInterval', 1000)
  }
}
