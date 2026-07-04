import { join } from 'node:path'
import { VError } from '@lvce-editor/verror'
import { build } from 'esbuild'

interface BundleNodeJsOptions {
  readonly cwd: string
  readonly from: string
  readonly outFile: string
  readonly external?: readonly string[]
}

export const bundleNodeJs = async ({
  cwd,
  from,
  outFile,
  external = [],
}: BundleNodeJsOptions): Promise<void> => {
  try {
    await build({
      absWorkingDir: cwd,
      bundle: true,
      entryPoints: [join(cwd, from)],
      external: [...external],
      format: 'esm',
      outfile: join(cwd, outFile),
      platform: 'node',
      sourcemap: false,
      target: ['node18'],
    })
  } catch (error) {
    throw new VError(error, 'Failed to bundle node js')
  }
}
