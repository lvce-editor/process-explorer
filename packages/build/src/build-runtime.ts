import { build } from 'esbuild'
import { root } from './root.ts'
import { runtimeBuildTargets } from './runtimeBuildTargets.ts'

const main = async () => {
  await Promise.all(
    runtimeBuildTargets.map((target) =>
      build({
        absWorkingDir: root,
        bundle: true,
        entryPoints: [target.entryPoint],
        external: target.external,
        format: 'esm',
        outfile: target.outfile,
      }),
    ),
  )
}

await main()
