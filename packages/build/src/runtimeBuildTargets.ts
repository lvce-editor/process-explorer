import type { BuildOptions } from 'esbuild'

export const runtimeBuildTargets = [
  {
    entryPoint: 'packages/extension/src/gitMain.ts',
    outfile: 'packages/extension/dist/gitMain.js',
  },
  {
    entryPoint: 'packages/git-worker/src/gitWorkerMain.ts',
    outfile: 'packages/git-worker/dist/gitWorkerMain.js',
  },
  {
    entryPoint: 'packages/git-web/src/gitWebMain.ts',
    outfile: 'packages/git-web/dist/gitWebMain.js',
    external: ['electron', 'node*'],
  },
] satisfies ReadonlyArray<Pick<BuildOptions, 'entryPoints' | 'outfile' | 'external'> & { entryPoint: string }>
