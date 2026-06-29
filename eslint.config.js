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
      'tsconfig/no-implicit-any': 'off',
      'tsconfig/dont-skip-lib-check': 'off',
    },
  },
  {
    files: [
      'test/ListProcessesWithMemoryUsageUnix.test.ts',
      'test/ListProcessesWithMemoryUsageWindows.test.ts',
      'test/WindowsProcessTree.test.ts',
    ],
    rules: {
      'jest/no-restricted-jest-methods': 'off',
    },
  },
]
