import { cp, readFile, rm, writeFile } from 'node:fs/promises'
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

export const getRemoteUrl = (path: string): string => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
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

const rendererWorkerPath = join(
  root,
  'dist',
  commitHash,
  'packages',
  'renderer-worker',
  'dist',
  'rendererWorkerMain.js',
)
const workerPath = join(
  root,
  '.tmp',
  'dist-process-explorer-worker',
  'index.js',
)
const remoteUrl = getRemoteUrl(workerPath)

const occurrence = `\`${remoteUrl}\``
const replacement = '\`${assetDir}/packages/process-explorer-worker/index.js\`'

const content = await readFile(rendererWorkerPath, 'utf8')
if (!content.includes(occurrence)) {
  throw new Error('occurrence not found')
}
const newContent = content.replace(occurrence, replacement)
await writeFile(rendererWorkerPath, newContent)

const indexHtmlPath = join(root, 'dist', 'index.html')
const indexHtml = await readFile(indexHtmlPath, 'utf8')
const configOccurrence = `"develop.processExplorerWorkerPath": "${remoteUrl}"`
if (!indexHtml.includes(configOccurrence)) {
  throw new Error('process explorer runtime worker URL not found')
}
await writeFile(
  indexHtmlPath,
  indexHtml.replace(
    configOccurrence,
    `"develop.processExplorerWorkerPath": "/${commitHash}/packages/process-explorer-worker/index.js"`,
  ),
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
