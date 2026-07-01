import { expect, test } from '@jest/globals'
import * as ListProcessGetName from '../src/parts/ListProcessGetName/ListProcessGetName.ts'

test('getName - detect chrome devtools', () => {
  const pid = 200_152
  const cmd =
    'packages/main-process/node_modules/electron/dist/electron --type=renderer --enable-crashpad --enable-crash-reporter=d476773f-ae60-4c60-85c5-d4f2eb675cee,no_channel --user-data-dir=/test.config/main-process --standard-schemes=lvce-oss --enable-sandbox --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path=/packages/main-process --lang=en-US --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=7 --launch-time-ticks=6086771284 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=0,i,17047493330214191737,6951987383812573163,131072 --disable-features=SpareRendererForSitePerProcess'
  const rootPid = 1
  const pidMap = {
    200_152: 'chrome-devtools',
  }
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe(
    'chrome-devtools',
  )
})

test('getName - detect renderer', () => {
  const pid = 200_152
  const cmd =
    '/packages/main-process/node_modules/electron/dist/electron --type=renderer --enable-crashpad --enable-crash-reporter=d476773f-ae60-4c60-85c5-d4f2eb675cee,no_channel --user-data-dir=/test.config/main-process --standard-schemes=lvce-oss --enable-sandbox --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path=/packages/main-process --lang=en-US --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=7 --launch-time-ticks=6086771284 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=0,i,17047493330214191737,6951987383812573163,131072 --disable-features=SpareRendererForSitePerProcess'
  const rootPid = 1
  const pidMap = {
    200_152: 'renderer',
  }
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe('renderer')
})

test('getName - unknown renderer', () => {
  const pid = 200_152
  const cmd =
    '/packages/main-process/node_modules/electron/dist/electron --type=renderer --enable-crashpad --enable-crash-reporter=d476773f-ae60-4c60-85c5-d4f2eb675cee,no_channel --user-data-dir=/test.config/main-process --standard-schemes=lvce-oss --enable-sandbox --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path=/packages/main-process --lang=en-US --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=7 --launch-time-ticks=6086771284 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=0,i,17047493330214191737,6951987383812573163,131072 --disable-features=SpareRendererForSitePerProcess'
  const rootPid = 1
  const pidMap = {}
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe('renderer')
})

test('getName - detect pty host', () => {
  const pid = 123
  const cmd = 'node dist/ptyHostMain.js'
  const rootPid = 1
  const pidMap = {}
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe('pty-host')
})

test('getName - detect extension host helper process', () => {
  const pid = 123
  const cmd = 'node dist/extensionHostHelperProcessMain.js'
  const rootPid = 1
  const pidMap = {}
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe(
    'extension-host-helper-process',
  )
})

test('getName - detect sublime', () => {
  const pid = 123
  const cmd = '/opt/sublime_text/sublime_text --fwdargv0 /usr/bin/subl'
  const rootPid = 1
  const pidMap = {}
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe(
    'sublime-text',
  )
})

test('getName - detect root process', () => {
  const pid = 123
  const cmd = 'node ./main.js'
  const rootPid = 123
  const pidMap = {}
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe('main')
})

test('getName - detect common process patterns', () => {
  const rootPid = 1
  const pidMap = {}
  expect(
    ListProcessGetName.getName(2, 'electron --type=zygote', rootPid, pidMap),
  ).toBe('zygote')
  expect(
    ListProcessGetName.getName(
      3,
      'electron --type=gpu-process',
      rootPid,
      pidMap,
    ),
  ).toBe('gpu-process')
  expect(
    ListProcessGetName.getName(
      4,
      'node dist/extensionHostMain.js',
      rootPid,
      pidMap,
    ),
  ).toBe('extension-host')
  expect(
    ListProcessGetName.getName(
      5,
      'electron --lvce-window-kind=process-explorer',
      rootPid,
      pidMap,
    ),
  ).toBe('process-explorer')
  expect(
    ListProcessGetName.getName(
      6,
      'node /test/node_modules/@lvce-editor/file-system-process/dist/index.js',
      rootPid,
      pidMap,
    ),
  ).toBe('file-system-process')
  expect(
    ListProcessGetName.getName(
      7,
      'node C:\\test\\node_modules\\@lvce-editor\\file-watcher-process\\dist\\index.js',
      rootPid,
      pidMap,
    ),
  ).toBe('file-watcher-process')
  expect(
    ListProcessGetName.getName(
      8,
      'node /test/node_modules/@lvce-editor/typescript-compile-process/dist/index.js',
      rootPid,
      pidMap,
    ),
  ).toBe('typescript-compile-process')
  expect(
    ListProcessGetName.getName(
      9,
      'node /test/packages/process-explorer/src/processExplorerMain.ts',
      rootPid,
      pidMap,
    ),
  ).toBe('process-explorer')
  expect(
    ListProcessGetName.getName(
      10,
      'node /test/packages/shared-process/src/sharedProcessMain.js',
      rootPid,
      pidMap,
    ),
  ).toBe('shared-process')
  expect(
    ListProcessGetName.getName(11, 'node tsserver.js', rootPid, pidMap),
  ).toBe('tsserver.js')
  expect(
    ListProcessGetName.getName(12, 'node typingsInstaller.js', rootPid, pidMap),
  ).toBe('typingsInstaller.js')
  expect(
    ListProcessGetName.getName(13, '/usr/bin/bash -i', rootPid, pidMap),
  ).toBe('/usr/bin/bash -i')
  expect(ListProcessGetName.getName(14, 'bash -i', rootPid, pidMap)).toBe(
    'bash',
  )
  expect(ListProcessGetName.getName(15, '/bin/rg test', rootPid, pidMap)).toBe(
    'ripgrep',
  )
  expect(
    ListProcessGetName.getName(16, 'C:\\tools\\rg.exe test', rootPid, pidMap),
  ).toBe('ripgrep')
  expect(
    ListProcessGetName.getName(
      17,
      'C:\\Windows\\System32\\conhost.exe',
      rootPid,
      pidMap,
    ),
  ).toBe('conhost.exe')
})

test('getName - pid map empty name', () => {
  const pid = 123
  const cmd = 'electron --type=renderer'
  const rootPid = 1
  const pidMap = {
    123: '',
  }
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe(
    '<unknown>',
  )
})

test('getName - fallback to command', () => {
  const pid = 123
  const cmd = 'custom-process --flag'
  const rootPid = 1
  const pidMap = {}
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe(cmd)
})
