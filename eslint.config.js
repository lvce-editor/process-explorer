import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'
import * as tsconfig from '@lvce-editor/eslint-plugin-tsconfig'

export default [
  ...config.default,
  ...actions.default,
  ...tsconfig.default,
  {
    rules: {
      '@cspell/spellchecker': 'off',
      'github-actions/ci-versions': 'off',
      'devcontainer/post-create-command': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
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
