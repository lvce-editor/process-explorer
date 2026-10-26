import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdtemp, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const requireTests = createRequire(
  join(root, 'packages/extension-host-worker-tests/package.json'),
)
const { _electron } = requireTests('playwright')
const { expect } = requireTests('@playwright/test')
const requireMain = createRequire(
  join(root, 'packages/main-process/package.json'),
)
const profile = await mkdtemp(join(tmpdir(), 'lvce-process-explorer-styles-'))
let app
try {
  const env = {
    ...process.env,
    DEV: '1',
    LVCE_ROOT: root,
    LVCE_SHARED_PROCESS_PATH: join(
      root,
      'packages/shared-process/src/sharedProcessMain.ts',
    ),
  }
  delete env.ELECTRON_RUN_AS_NODE
  for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE'])
    env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
  app = await _electron.launch({
    executablePath: requireMain('electron'),
    args: [
      '--no-sandbox',
      `--user-data-dir=${join(profile, 'chromium')}`,
      '.',
      profile,
    ],
    cwd: join(root, 'packages/main-process'),
    env,
    timeout: 60000,
  })
  const childEnv = await app.evaluate(() =>
    Object.fromEntries(
      ['CONFIG', 'DATA', 'STATE', 'CACHE'].map((key) => [
        key,
        process.env[`XDG_${key}_HOME`],
      ]),
    ),
  )
  for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE'])
    assert.equal(childEnv[key], join(profile, key.toLowerCase()))
  const page = await app.firstWindow()
  page.setDefaultTimeout(15000)
  page.on('pageerror', (error) => console.error(error))
  await expect(page.locator('#Workbench')).toBeVisible({ timeout: 60000 })
  await expect(page.getByRole('tree', { name: 'Files Explorer' })).toBeVisible()
  const renderer = page
    .workers()
    .find((worker) => worker.url().includes('rendererWorkerMain'))
  assert.ok(renderer, 'Expected the renderer worker')
  const Command = {
    execute: (command, ...args) =>
      renderer.evaluate(
        async ({ command, args }) => {
          const module = await import(
            new URL('./parts/Command/Command.js', globalThis.location.href).href
          )
          return module.execute(command, ...args)
        },
        { command, args },
      ),
  }
  const tests = join(root, 'packages/extension-host-worker-tests/src')
  const files = await readdir(tests)
  assert.ok(files.includes('viewlet.process-explorer-focused-row-style.js'))
  assert.ok(files.includes('viewlet.process-explorer-error-style.js'))
  for (const file of files
    .filter((file) => file.endsWith('.js') && file !== '_all.js')
    .sort()) {
    const scenario = await import(pathToFileURL(join(tests, file)).href)
    await scenario.test({
      Command,
      expect,
      KeyBoard: { press: (key) => page.keyboard.press(key) },
      Locator: (selector) => page.locator(selector),
    })
    console.log(`PASS ${scenario.name} (Electron)`)
  }
} finally {
  try {
    if (app) {
      // LVCE can cancel app.quit() while persisting window state. On macOS
      // closing the last window then keeps the process alive. This isolated
      // acceptance app has no user state to save, so exit it explicitly.
      await app.evaluate(({ app }) => app.exit(0)).catch(() => {})
      await app.close().catch(() => {})
    }
  } finally {
    await rm(profile, { recursive: true, force: true })
  }
}
