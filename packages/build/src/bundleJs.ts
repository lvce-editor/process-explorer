import { join } from 'node:path'
import { VError } from '@lvce-editor/verror'
import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import {
  rollup,
  type ModuleFormat,
  type OutputOptions,
  type RollupOptions,
} from 'rollup'

const commonjsPlugin =
  commonjs as unknown as typeof import('@rollup/plugin-commonjs').default

interface BundleJsOptions {
  readonly cwd: string
  readonly from: string
  readonly outFile: string
  readonly browser?: boolean
  readonly codeSplitting?: boolean
  readonly external?: readonly string[]
  readonly typescript?: boolean
}

export const bundleJs = async ({
  cwd,
  from,
  outFile,
  browser = false,
  codeSplitting = false,
  external = [],
  typescript = from.endsWith('.ts'),
}: BundleJsOptions): Promise<void> => {
  try {
    const plugins: RollupOptions['plugins'] = [
      nodeResolve({
        browser,
        preferBuiltins: true,
      }),
      commonjsPlugin(),
    ]
    if (typescript) {
      plugins.push(
        babel({
          babelHelpers: 'bundled',
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          presets: [pluginTypeScript],
        }),
      )
    }
    const inputOptions: RollupOptions = {
      cache: false,
      input: join(cwd, from),
      preserveEntrySignatures: 'strict',
      treeshake: {
        propertyReadSideEffects: false,
      },
      perf: true,
      external: [...external],
      plugins,
    }
    const result = await rollup(inputOptions)
    const outputFormat: ModuleFormat = 'es'
    const outputOptions: OutputOptions = {
      paths: {},
      sourcemap: false,
      format: outputFormat,
      extend: false,
      file: join(cwd, outFile),
      entryFileNames: 'renderer-process.modern.js',
      exports: 'auto',
      freeze: false,
      inlineDynamicImports: !codeSplitting,
      minifyInternalExports: false,
      generatedCode: {
        constBindings: true,
        objectShorthand: true,
      },
      hoistTransitiveImports: false,
    }
    await result.write(outputOptions)
  } catch (error) {
    throw new VError(error, 'Failed to bundle js')
  }
}
