import { readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..', '..', '..')

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const replace = async ({ path, marker, occurrence, replacement }) => {
  const content = await readFile(path, 'utf8')
  if (content.includes(marker)) {
    return
  }
  if (!content.includes(occurrence)) {
    throw new Error(`Could not find expected content in ${path}`)
  }
  const newContent = content.replace(occurrence, replacement)
  await writeFile(path, newContent)
}

const nodeModulesPath = join(root, 'packages', 'server', 'node_modules')
const workerPath = join(
  root,
  '.tmp',
  'dist-process-explorer-worker',
  'index.js',
)
const processExplorerPath = join(root, 'dist', 'dist', 'index.js')

const serverStaticPath = join(
  nodeModulesPath,
  '@lvce-editor',
  'static-server',
  'static',
)

const RE_COMMIT_HASH = /^[a-z\d]+$/
const isCommitHash = (dirent) => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
}

const dirents = await readdir(serverStaticPath)
const commitHash = dirents.find(isCommitHash) || ''
const rendererWorkerMainPath = join(
  serverStaticPath,
  commitHash,
  'packages',
  'renderer-worker',
  'dist',
  'rendererWorkerMain.js',
)
const processExplorerPathPath = join(
  nodeModulesPath,
  '@lvce-editor',
  'shared-process',
  'src',
  'parts',
  'ProcessExplorerPath',
  'ProcessExplorerPath.js',
)

const workerRemoteUrl = getRemoteUrl(workerPath)
await replace({
  path: rendererWorkerMainPath,
  marker: '// const processExplorerWorkerUrl = ',
  occurrence: `const processExplorerWorkerUrl = \`\${assetDir}/packages/process-explorer-worker/index.js\``,
  replacement: `// const processExplorerWorkerUrl = \`\${assetDir}/packages/process-explorer-worker/index.js\`
const processExplorerWorkerUrl = \`${workerRemoteUrl}\``,
})

await replace({
  path: processExplorerPathPath,
  marker: '// export const processExplorerPath = ',
  occurrence: `export const processExplorerPath = Path.join(Root.root, 'packages', 'shared-process', 'node_modules', '@lvce-editor', 'process-explorer', 'dist', 'index.js');`,
  replacement: `// export const processExplorerPath = Path.join(Root.root, 'packages', 'shared-process', 'node_modules', '@lvce-editor', 'process-explorer', 'dist', 'index.js');
export const processExplorerPath = ${JSON.stringify(processExplorerPath)};`,
})
