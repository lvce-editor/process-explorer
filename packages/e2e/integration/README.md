# Application integration tests

These scenarios and fixtures moved from `lvce-editor` to `lvce-editor/process-explorer`. The Integration workflow overlays this repository's build in a pinned, disposable LVCE checkout and runs the scenarios in the real Electron application. Process Explorer is intentionally unsupported in the browser runtime.

The Integration workflow runs both style scenarios on Linux, macOS and Windows. The Linux job also retains the network service naming regression.

Build this repository and install the pinned application's dependencies, then run:

```sh
node packages/e2e/integration/prepare.mjs /path/to/disposable/lvce-editor
cd /path/to/disposable/lvce-editor
node node_modules/electron/install.js
node scripts/test-process-explorer-styles.mjs
```

On headless Linux, prefix the test command with `xvfb-run -a`. The runner isolates Chromium and all XDG application state and executes every prepared style scenario, including the existing error-style assertions.

Preparation replaces the disposable application's scenarios and fixtures and overlays local build artifacts. See `config.json` for artifact and script destinations, and `.github/workflows/integration.yml` for static export, Electron, and settings requirements. Update the pinned application commit when its runtime needs updating.

On Linux, the workflow also runs `xvfb-run -a node scripts/test-process-explorer-network-service.mjs` from the prepared application checkout. This Electron regression checks the network service label, verifies its PID against `/proc`, and confirms the label and PID survive a Process Explorer refresh.
