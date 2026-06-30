import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'
import * as tsconfig from '@lvce-editor/eslint-plugin-tsconfig'

export default [
  ...config.default,
  ...actions.default,
  ...tsconfig.default,
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@cspell/spellchecker': 'off',
      'github-actions/ci-versions': 'off',
      'devcontainer/post-create-command': 'off',
      'tsconfig/no-implicit-any': 'off',
      'tsconfig/dont-skip-lib-check': 'off',
    },
  },
  {
    files: [
      'packages/process-explorer/test/ListProcessesWithMemoryUsageUnix.test.ts',
      'packages/process-explorer/test/ListProcessesWithMemoryUsageWindows.test.ts',
      'packages/process-explorer/test/WindowsProcessTree.test.ts',
    ],
    rules: {
      'jest/no-restricted-jest-methods': 'off',
    },
  },
]
