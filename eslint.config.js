import * as config from '@lvce-editor/eslint-config'

export default [
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
      'packages/process-explorer/test/ListProcessesWithMemoryUsageUnix.test.ts',
      'packages/process-explorer/test/ListProcessesWithMemoryUsageWindows.test.ts',
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
      'packages/process-explorer-worker/src/parts/CollapseAll/CollapseAll.ts',
      'packages/process-explorer-worker/src/parts/Create/Create.ts',
      'packages/process-explorer-worker/src/parts/DebugProcess/DebugProcess.ts',
      'packages/process-explorer-worker/src/parts/ExpandAll/ExpandAll.ts',
      'packages/process-explorer-worker/src/parts/FocusFirst/FocusFirst.ts',
      'packages/process-explorer-worker/src/parts/FocusIndex/FocusIndex.ts',
      'packages/process-explorer-worker/src/parts/FocusLast/FocusLast.ts',
      'packages/process-explorer-worker/src/parts/FocusNext/FocusNext.ts',
      'packages/process-explorer-worker/src/parts/FocusPrevious/FocusPrevious.ts',
      'packages/process-explorer-worker/src/parts/GetMenuEntries/GetMenuEntries.ts',
      'packages/process-explorer-worker/src/parts/HandleArrowLeft/HandleArrowLeft.ts',
      'packages/process-explorer-worker/src/parts/HandleContextMenu/HandleContextMenu.ts',
      'packages/process-explorer-worker/src/parts/HandleDoubleClick/HandleDoubleClick.ts',
      'packages/process-explorer-worker/src/parts/InitializeProcessExplorer/InitializeProcessExplorer.ts',
      'packages/process-explorer-worker/src/parts/KillProcess/KillProcess.ts',
      'packages/process-explorer-worker/src/parts/LoadContent/LoadContent.ts',
      'packages/process-explorer-worker/src/parts/ProcessExplorer/ProcessExplorer.ts',
      'packages/process-explorer-worker/src/parts/Refresh/Refresh.ts',
      'packages/process-explorer-worker/src/parts/SetUpdateInterval/SetUpdateInterval.ts',
      'packages/process-explorer-worker/src/parts/ToggleIndex/ToggleIndex.ts',
    ],
    rules: {
      'virtual-dom/prefer-state-destructuring': 'off',
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
      'virtual-dom/prefer-state-destructuring': 'off',
    },
  },
]
