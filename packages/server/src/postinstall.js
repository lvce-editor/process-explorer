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

const nodeModulesPath = join(root, 'node_modules')
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
const rendererProcessMainPath = join(
  serverStaticPath,
  commitHash,
  'packages',
  'renderer-process',
  'dist',
  'rendererProcessMain.js',
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
  path: rendererProcessMainPath,
  marker: 'const MultiNavigation = 18;',
  occurrence: 'const SetReferenceNodeUid = 11;',
  replacement: `const SetReferenceNodeUid = 11;
const MultiNavigation = 18;`,
})

await replace({
  path: rendererProcessMainPath,
  marker: 'const handleNavigateChild = (state, index, nextPatchType) => {',
  occurrence: `const handleNavigateChild = (state, patches, patchIndex) => {
  const patch = patches[patchIndex];
  const $Children = state.current.childNodes;
  const $Child = $Children[patch.index];
  if ($Child) {
    state.current = $Child;
    return true;
  }
  const nextPatch = patches[patchIndex + 1];
  if (nextPatch && (nextPatch.type === Replace || nextPatch.type === SetReferenceNodeUid) && patch.index === $Children.length) {
    const $Placeholder = document.createComment('virtual-dom-placeholder');
    state.current.append($Placeholder);
    state.current = $Placeholder;
    return true;
  }
  console.error('Cannot navigate to child: child not found at index', {
    $Current: state.current,
    index: patch.index,
    childCount: $Children.length
  });
  return false;
};`,
  replacement: `const handleNavigateChild = (state, index, nextPatchType) => {
  const $Children = state.current.childNodes;
  const $Child = $Children[index];
  if ($Child) {
    state.current = $Child;
    return true;
  }
  if ((nextPatchType === Replace || nextPatchType === SetReferenceNodeUid) && index === $Children.length) {
    const $Placeholder = document.createComment('virtual-dom-placeholder');
    state.current.append($Placeholder);
    state.current = $Placeholder;
    return true;
  }
  console.error('Cannot navigate to child: child not found at index', {
    $Current: state.current,
    index,
    childCount: $Children.length
  });
  return false;
};`,
})

await replace({
  path: rendererProcessMainPath,
  marker: 'const handleSingleNavigation = (',
  occurrence: `const handleNavigationPatch = (state, patch, patches, patchIndex, $Element) => {
  switch (patch.type) {
    case NavigateChild:
      return handleNavigateChild(state, patches, patchIndex);
    case NavigateParent:
      return handleNavigateParent(state);
    case NavigateSibling:
      return handleNavigateSibling(state, patch, $Element, patchIndex);
    default:
      return true;
  }
};`,
  replacement: `const handleSingleNavigation = (state, type, index, nextPatchType, $Element, patchIndex) => {
  switch (type) {
    case NavigateChild:
      return handleNavigateChild(state, index, nextPatchType);
    case NavigateParent:
      return handleNavigateParent(state);
    case NavigateSibling:
      return handleNavigateSibling(state, { index }, $Element, patchIndex);
    default:
      console.error('Unknown navigation type', { type });
      return false;
  }
};
const handleMultiNavigation = (state, navigations, nextPatchType, $Element, patchIndex) => {
  for (let i = 0; i < navigations.length; i += 2) {
    const type = navigations[i];
    const index = navigations[i + 1];
    const nextType = navigations[i + 2] ?? nextPatchType;
    if (!handleSingleNavigation(state, type, index, nextType, $Element, patchIndex)) {
      return false;
    }
  }
  return true;
};
const handleNavigationPatch = (state, patch, patches, patchIndex, $Element) => {
  switch (patch.type) {
    case MultiNavigation:
      return handleMultiNavigation(state, patch.navigations, patches[patchIndex + 1]?.type, $Element, patchIndex);
    case NavigateChild:
      return handleNavigateChild(state, patch.index, patches[patchIndex + 1]?.type);
    case NavigateParent:
      return handleNavigateParent(state);
    case NavigateSibling:
      return handleNavigateSibling(state, patch, $Element, patchIndex);
    default:
      return true;
  }
};`,
})

await replace({
  path: processExplorerPathPath,
  marker: '// export const processExplorerPath = ',
  occurrence: `import * as ResolveBin from '../ResolveBin/ResolveBin.js'

export const processExplorerPath = ResolveBin.resolveBin('@lvce-editor/process-explorer')
`,
  replacement: `// import * as ResolveBin from '../ResolveBin/ResolveBin.js'
// export const processExplorerPath = ResolveBin.resolveBin('@lvce-editor/process-explorer')
export const processExplorerPath = ${JSON.stringify(processExplorerPath)}`,
})
