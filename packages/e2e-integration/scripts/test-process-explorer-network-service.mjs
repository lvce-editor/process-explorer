import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import {
  chmod,
  mkdtemp,
  mkdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseKeyBindingString } from '../packages/renderer-worker/src/parts/ParseKeyBindingString/ParseKeyBindingString.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const requireTests = createRequire(
  join(root, 'packages/extension-host-worker-tests/package.json'),
)
const { _electron } = requireTests('playwright')
const { expect } = requireTests('@playwright/test')
const profile = await mkdtemp(join(tmpdir(), 'lvce-network-service-'))
let app
let typescriptServer
try {
  const typescriptServerPath = join(
    profile,
    'language-servers/typescript/lib/tsc',
  )
  await mkdir(dirname(typescriptServerPath), { recursive: true })
  await writeFile(typescriptServerPath, '#!/bin/sh\nsleep 300\n')
  await chmod(typescriptServerPath, 0o755)
  typescriptServer = spawn(typescriptServerPath, ['--lsp', '--stdio'], {
    stdio: 'ignore',
  })
  await new Promise((resolve, reject) => {
    typescriptServer.once('spawn', resolve)
    typescriptServer.once('error', reject)
  })
  await mkdir(join(profile, 'config/lvce-oss'), { recursive: true })
  await writeFile(
    join(profile, 'config/lvce-oss/keybindings.json'),
    JSON.stringify([
      {
        source: 'User',
        key: parseKeyBindingString('Ctrl+Alt+1'),
        command: 'Developer.openProcessExplorer',
      },
    ]),
  )
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
    executablePath: join(
      root,
      'packages/main-process/node_modules/electron/dist/electron',
    ),
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
  await expect(page.locator('#Workbench')).toBeVisible()
  await expect(page.getByRole('tree', { name: 'Files Explorer' })).toBeVisible()
  await page.keyboard.press('Control+Alt+1')
  await expect(page.locator('.ProcessExplorerTable')).toBeVisible()
  const networkRow = page.locator('.ProcessExplorerRow').filter({
    has: page.locator('.ProcessExplorerNameCell', {
      hasText: /^utility-network-service$/,
    }),
  })
  await expect(networkRow).toHaveCount(1)
  const cells = networkRow.locator('.ProcessExplorerCell')
  const pid = Number(await cells.nth(1).textContent())
  assert.ok(pid > 0)
  const cmd = await readFile(`/proc/${pid}/cmdline`, 'utf8')
  assert.match(
    cmd,
    /(?:^|[\s\0])--utility-sub-type=network\.mojom\.NetworkService(?:[\s\0]|$)/,
  )
  await expect(cells.nth(2)).not.toHaveText('')
  const typescriptRow = page.locator('.ProcessExplorerRow').filter({
    has: page.locator('.ProcessExplorerNameCell', {
      hasText: /^TypeScript Language Server$/,
    }),
  })
  await expect(typescriptRow).toHaveCount(1)
  const typescriptCells = typescriptRow.locator('.ProcessExplorerCell')
  await expect(typescriptCells.nth(1)).toHaveText(String(typescriptServer.pid))
  await expect(typescriptCells.nth(2)).not.toHaveText('')
  const typescriptCommand = await typescriptRow.getAttribute('title')
  assert.ok(typescriptCommand?.includes(typescriptServerPath))
  assert.match(typescriptCommand, /--lsp --stdio/)
  await expect(
    page.locator('.ProcessExplorerNameCell', { hasText: /^main$/ }),
  ).toBeVisible()
  const renderer = page
    .workers()
    .find((worker) => worker.url().includes('rendererWorkerMain'))
  assert.ok(renderer, 'Expected the renderer worker')
  await renderer.evaluate(async () => {
    const Command = await import(
      new URL('./parts/Command/Command.js', globalThis.location.href).href
    )
    await Command.execute('ProcessExplorer.refresh')
  })
  await expect(networkRow).toHaveCount(1)
  await expect(cells.nth(1)).toHaveText(String(pid))
  await expect(typescriptRow).toHaveCount(1)
  await expect(typescriptCells.nth(1)).toHaveText(String(typescriptServer.pid))
  assert.equal(await typescriptRow.getAttribute('title'), typescriptCommand)
  await expect(page.locator('.ProcessExplorerError')).toBeHidden()
  if (process.env.PROCESS_EXPLORER_SCREENSHOT)
    await page.screenshot({ path: process.env.PROCESS_EXPLORER_SCREENSHOT })
  console.log(
    `Electron NetworkService PID ${pid} and TypeScript language-server PID ${typescriptServer.pid} display their concise names and retain their command tooltips before and after refresh`,
  )
} finally {
  typescriptServer?.kill()
  await app?.close()
  await rm(profile, { recursive: true, force: true })
}
