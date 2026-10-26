import { cp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.ts'

interface ExportStaticResult {
  readonly commitHash: string
}

interface SharedProcess {
  readonly exportStatic: (options: {
    readonly extensionPath: string
    readonly root: string
    readonly testPath: string
  }) => Promise<ExportStaticResult>
}

const sharedProcessPath = join(
  root,
  'node_modules',
  '@lvce-editor',
  'shared-process',
  'index.js',
)
const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()
const sharedProcess = (await import(sharedProcessUrl)) as SharedProcess

process.env.PATH_PREFIX = '/process-explorer'
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  testPath: 'packages/e2e',
})

const workerPath = join(
  root,
  '.tmp',
  'dist-process-explorer-worker',
  'index.js',
)

const staticDist = join(root, '.tmp', 'static')
await rm(staticDist, { recursive: true, force: true })
await cp(join(root, 'dist'), staticDist, { recursive: true })
await cp(
  workerPath,
  join(
    staticDist,
    commitHash,
    'packages',
    'process-explorer-worker',
    'index.js',
  ),
)
