import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedVirtualDom,
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
      'packages/process-explorer/test/ListProcessesWithMemoryUsageMacos.test.ts',
      'packages/process-explorer/test/ListProcessesWithMemoryUsageLinux.test.ts',
      'packages/process-explorer/test/ListProcessesWithMemoryUsageUnix.test.ts',
      'packages/process-explorer/test/ListProcessesWithMemoryUsageWindows.test.ts',
      'packages/process-explorer/test/LoadWindowsProcessTree.test.ts',
      'packages/process-explorer/test/ProcessId.test.ts',
      'packages/process-explorer/test/E2eFixtureProcess.test.ts',
      'packages/process-explorer/test/WindowsProcessTree.test.ts',
      'packages/process-explorer-worker/test/E2eFixtureProcess.test.ts',
      'packages/process-explorer-worker/test/InitializeProcessExplorer.test.ts',
      'packages/process-explorer-worker/test/LaunchProcessExplorerElectron.test.ts',
      'packages/process-explorer-worker/test/LaunchProcessExplorerNode.test.ts',
      'packages/process-explorer-worker/test/Refresh.test.ts',
    ],
    rules: {
      'jest/no-restricted-jest-methods': 'off',
    },
  },
  {
    files: [
      'packages/process-explorer-worker/src/parts/LaunchProcessExplorerNode/LaunchProcessExplorerNode.ts',
    ],
    rules: {
      'virtual-dom/no-object-attribute-values': 'off',
    },
  },
  {
    files: ['packages/process-explorer-worker/test/**/*.ts'],
    rules: {
      'virtual-dom/no-object-attribute-values': 'off',
      'virtual-dom/prefer-merge-class-names': 'off',
    },
  },
])
