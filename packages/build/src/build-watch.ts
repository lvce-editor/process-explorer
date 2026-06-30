import { context } from 'esbuild'
import { root } from './root.ts'
import { runtimeBuildTargets } from './runtimeBuildTargets.ts'

const main = async () => {
  for (const target of runtimeBuildTargets) {
    const buildContext = await context({
      absWorkingDir: root,
      bundle: true,
      entryPoints: [target.entryPoint],
      external: target.external,
      format: 'esm',
      outfile: target.outfile,
    })
    await buildContext.watch()
  }
}

main()
