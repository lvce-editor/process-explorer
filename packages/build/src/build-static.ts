import { cp, readdir } from 'node:fs/promises'
import path, { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.ts'

await import('./build.ts')

await cp(path.join(root, 'dist'), path.join(root, 'dist2'), {
  recursive: true,
  force: true,
})

const sharedProcessPath = join(root, 'packages', 'server', 'node_modules', '@lvce-editor', 'shared-process', 'index.js')

const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()

const sharedProcess = await import(sharedProcessUrl)

await sharedProcess.exportStatic({
  extensionPath: 'packages/extension',
  testPath: 'packages/e2e',
  root,
})

const RE_COMMIT_HASH = /^[a-z\d]+$/
const isCommitHash = (dirent: string): boolean => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH) !== null
}

const dirents = await readdir(path.join(root, 'dist'))
const commitHash = dirents.find(isCommitHash) || ''

await cp(path.join(root, 'dist2'), path.join(root, 'dist', commitHash, 'extensions', 'builtin.git'), { recursive: true, force: true })
