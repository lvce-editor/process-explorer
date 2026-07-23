import { VError } from '@lvce-editor/verror'
import { bundleJs } from './bundleJs.ts'

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
    await bundleJs({
      cwd,
      from,
      outFile,
      external,
    })
  } catch (error) {
    throw new VError(error, 'Failed to bundle node js')
  }
}
