import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
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
const processExplorerPath = join(
  root,
  'packages',
  'process-explorer',
  'src',
  'processExplorerMain.ts',
)

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
const protocolTypePath = join(
  nodeModulesPath,
  '@lvce-editor',
  'shared-process',
  'src',
  'parts',
  'ProtocolType',
  'ProtocolType.js',
)
const handleWebSocketModulePath = join(
  nodeModulesPath,
  '@lvce-editor',
  'shared-process',
  'src',
  'parts',
  'HandleWebSocketModule',
  'HandleWebSocketModule.js',
)
const handleIpcProcessExplorerPath = join(
  nodeModulesPath,
  '@lvce-editor',
  'shared-process',
  'src',
  'parts',
  'HandleIpcProcessExplorer',
  'HandleIpcProcessExplorer.js',
)
const handleWebSocketForProcessExplorerPath = join(
  nodeModulesPath,
  '@lvce-editor',
  'shared-process',
  'src',
  'parts',
  'HandleWebSocketForProcessExplorer',
  'HandleWebSocketForProcessExplorer.js',
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
  occurrence: `import * as ResolveBin from '../ResolveBin/ResolveBin.js';
export const processExplorerPath = ResolveBin.resolveBin('@lvce-editor/process-explorer');
`,
  replacement: `// import * as ResolveBin from '../ResolveBin/ResolveBin.js';
// export const processExplorerPath = ResolveBin.resolveBin('@lvce-editor/process-explorer');
export const processExplorerPath = ${JSON.stringify(processExplorerPath)};`,
})

await replace({
  path: protocolTypePath,
  marker: 'export const ProcessExplorer = ',
  occurrence: `export const TerminalProcess = 'terminal-process';`,
  replacement: `export const TerminalProcess = 'terminal-process';
export const ProcessExplorer = 'process-explorer';`,
})

await mkdir(dirname(handleWebSocketForProcessExplorerPath), { recursive: true })
await writeFile(
  handleWebSocketForProcessExplorerPath,
  `import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js';
import * as IpcId from '../IpcId/IpcId.js';
export const handleWebSocket = (message, handle) => {
    return HandleIncomingIpc.handleIncomingIpc(IpcId.ProcessExplorer, handle, message);
};
`,
)

await replace({
  path: handleWebSocketModulePath,
  marker: 'import * as HandleWebSocketForProcessExplorer from ',
  occurrence: `import * as HandleWebSocketForFileSystemProcess from '../HandleWebSocketForFileSystemProcess/HandleWebSocketForFileSystemProcess.js';`,
  replacement: `import * as HandleWebSocketForFileSystemProcess from '../HandleWebSocketForFileSystemProcess/HandleWebSocketForFileSystemProcess.js';
import * as HandleWebSocketForProcessExplorer from '../HandleWebSocketForProcessExplorer/HandleWebSocketForProcessExplorer.js';`,
})

await replace({
  path: handleWebSocketModulePath,
  marker: 'case ProtocolType.ProcessExplorer:',
  occurrence: `        case ProtocolType.FileSystemProcess:
            return HandleWebSocketForFileSystemProcess;`,
  replacement: `        case ProtocolType.FileSystemProcess:
            return HandleWebSocketForFileSystemProcess;
        case ProtocolType.ProcessExplorer:
            return HandleWebSocketForProcessExplorer;`,
})

await replace({
  path: handleIpcProcessExplorerPath,
  marker: `import * as IpcId from '../IpcId/IpcId.js';`,
  occurrence: `import * as Assert from '../Assert/Assert.js';`,
  replacement: `import * as Assert from '../Assert/Assert.js';
import * as IpcId from '../IpcId/IpcId.js';`,
})

await replace({
  path: handleIpcProcessExplorerPath,
  marker: 'export const targetWebSocket = ',
  occurrence: `export const targetMessagePort = () => {
    return ProcessExplorer.getOrCreate();
};`,
  replacement: `export const targetWebSocket = () => {
    return ProcessExplorer.getOrCreate();
};
export const targetMessagePort = () => {
    return ProcessExplorer.getOrCreate();
};`,
})

await replace({
  path: handleIpcProcessExplorerPath,
  marker: 'export const upgradeWebSocket = ',
  occurrence: `export const upgradeMessagePort = (port) => {
    Assert.object(port);
    return {
        type: 'send',
        method: 'HandleElectronMessagePort.handleElectronMessagePort',
        params: [port],
    };
};`,
  replacement: `export const upgradeWebSocket = (handle, message) => {
    Assert.object(handle);
    Assert.object(message);
    return {
        type: 'send',
        method: 'HandleWebSocket.handleWebSocket',
        params: [handle, message, IpcId.ProcessExplorerRenderer],
    };
};
export const upgradeMessagePort = (port) => {
    Assert.object(port);
    return {
        type: 'send',
        method: 'HandleElectronMessagePort.handleElectronMessagePort',
        params: [port],
    };
};`,
})
