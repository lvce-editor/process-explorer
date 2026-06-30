import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execa } from 'execa'
import { bundleJs } from './bundleJs.ts'
import { root } from './root.ts'

const dist = join(root, 'dist')

const readJson = async (path: string): Promise<any> => {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content)
}

const writeJson = async (path: string, json: any): Promise<void> => {
  await writeFile(path, JSON.stringify(json, null, 2) + '\n')
}

const getGitTagFromGit = async (): Promise<string> => {
  const { stdout, stderr, exitCode } = await execa(
    'git',
    ['describe', '--exact-match', '--tags'],
    {
      reject: false,
    },
  )
  if (exitCode) {
    if (
      exitCode === 128 &&
      stderr.startsWith('fatal: no tag exactly matches')
    ) {
      return '0.0.0-dev'
    }
    return '0.0.0-dev'
  }
  if (stdout.startsWith('v')) {
    return stdout.slice(1)
  }
  return stdout
}

const getVersion = async (): Promise<string> => {
  const { env } = process
  const { RG_VERSION, GIT_TAG } = env
  if (RG_VERSION) {
    return RG_VERSION.startsWith('v') ? RG_VERSION.slice(1) : RG_VERSION
  }
  if (GIT_TAG) {
    return GIT_TAG.startsWith('v') ? GIT_TAG.slice(1) : GIT_TAG
  }
  return getGitTagFromGit()
}

const replace = async ({
  path,
  occurrence,
  replacement,
}: {
  readonly path: string
  readonly occurrence: string
  readonly replacement: string
}): Promise<void> => {
  const content = await readFile(path, 'utf8')
  const newContent = content.replace(occurrence, replacement)
  await writeFile(path, newContent)
}

await rm(dist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })

await bundleJs({
  cwd: root,
  from: 'packages/process-explorer/src/processExplorerMain.ts',
  outFile: 'dist/dist/index.js',
  external: [
    '@lvce-editor/assert',
    '@lvce-editor/ipc',
    '@lvce-editor/json-rpc',
    '@lvce-editor/verror',
    '@vscode/windows-process-tree',
  ],
})

await cp(join(root, 'bin'), join(dist, 'bin'), { recursive: true })

await replace({
  path: join(dist, 'bin', 'processExplorer.js'),
  occurrence: 'src/processExplorerMain.js',
  replacement: 'dist/index.js',
})

const version = await getVersion()
const packageJson = await readJson(
  join(root, 'packages', 'process-explorer', 'package.json'),
)

delete packageJson.scripts
delete packageJson.devDependencies
delete packageJson.prettier
delete packageJson.jest
packageJson.version = version
packageJson.main = 'dist/index.js'

await writeJson(join(dist, 'package.json'), packageJson)
await cp(join(root, 'README.md'), join(dist, 'README.md'))
await cp(join(root, 'LICENSE'), join(dist, 'LICENSE'))
