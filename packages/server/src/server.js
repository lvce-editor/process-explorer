import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../../', import.meta.url))

process.argv.push(
  `--process-explorer-worker=${join(root, '.tmp', 'dist-process-explorer-worker', 'index.js')}`,
  `--process-explorer=${join(root, 'packages', 'process-explorer', 'src', 'processExplorerMain.ts')}`,
)

await import('@lvce-editor/server/bin/server.js')
