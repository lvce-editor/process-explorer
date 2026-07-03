import * as config from '@lvce-editor/eslint-config'

export default [
  ...config.default,
  ...config.recommendedActions,
  ...config.recommendedRegex,
  ...config.recommendedTsconfig,
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
      'packages/process-explorer-worker/test/InitializeProcessExplorer.test.ts',
      'packages/process-explorer-worker/test/LaunchProcessExplorerElectron.test.ts',
      'packages/process-explorer-worker/test/LaunchProcessExplorerNode.test.ts',
      'packages/process-explorer-worker/test/Refresh.test.ts',
    ],
    rules: {
      'jest/no-restricted-jest-methods': 'off',
    },
  },
]
