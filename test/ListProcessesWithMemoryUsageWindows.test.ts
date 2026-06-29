import { beforeEach, expect, jest, test } from '@jest/globals'
import { VError } from '../src/parts/VError/VError.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/CreatePidMap/CreatePidMap.ts', () => ({
  createPidMap() {
    return {}
  },
}))

jest.unstable_mockModule('@vscode/windows-process-tree', () => {
  return {
    getProcessCpuUsage: jest.fn(),
    getProcessList: jest.fn(),
    ProcessDataFlag: {
      CommandLine: 1,
      Memory: 2,
    },
  }
})

const WindowsProcessTree = await import('@vscode/windows-process-tree')
const ListProcessesWithMemoryUsage = await import('../src/parts/ListProcessesWithMemoryUsageWindows/ListProcessesWithMemoryUsageWindows.js')

test('listProcessesWithMemoryUsage', async () => {
  // @ts-ignore
  WindowsProcessTree.getProcessList.mockImplementation((rootPid, callback) => {
    callback([
      {
        commandLine: 'C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe .',
        cpu: 0.19305019305019305,
        memory: 95_653_888,
        name: 'electron.exe',
        pid: 9176,
        ppid: 9256,
      },
      {
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=gpu-process --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --gpu-preferences=UAAAAAAAAADgAAAYAAAAAAAAAAAAAAAAAABgAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgAAAAAAAAASAAAAAAAAAAYAAAAAgAAABAAAAAAAAAAGAAAAAAAAAAQAAAAAAAAAAAAAAAOAAAAEAAAAAAAAAABAAAADgAAAAgAAAAAAAAACAAAAAAAAAA= --mojo-platform-channel-handle=1628 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:2',
        cpu: 0.19305019305019305,
        memory: 94_089_216,
        name: 'electron.exe',
        pid: 7004,
        ppid: 9176,
      },
      {
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=utility --utility-sub-type=network.mojom.NetworkService --lang=en-US --service-sandbox-type=none --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --mojo-platform-channel-handle=1832 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:8',
        cpu: 0,
        memory: 43_425_792,
        name: 'electron.exe',
        pid: 5892,
        ppid: 9176,
      },
      {
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=renderer --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path="C:\\Users\\test-user\\Documents\\app\\packages\\main-process" --enable-sandbox --lang=en-US --device-scale-factor=1 --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=4 --launch-time-ticks=3327042247 --mojo-platform-channel-handle=2184 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:1',
        cpu: 0,
        memory: 83_259_392,
        name: 'electron.exe',
        pid: 11_608,
        ppid: 9176,
      },
      {
        commandLine:
          'C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe --experimental-json-modules --max-old-space-size=60 --enable-source-maps C:\\Users\\test-user\\Documents\\app\\packages\\extension-host\\src\\extensionHostMain.js',
        cpu: 0,
        memory: 75_100_160,
        name: 'electron.exe',
        pid: 9612,
        ppid: 9176,
      },
      {
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=renderer --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path="C:\\Users\\test-user\\Documents\\app\\packages\\main-process" --enable-sandbox --lang=en-US --device-scale-factor=1 --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=5 --launch-time-ticks=3330732877 --mojo-platform-channel-handle=3216 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:1',
        cpu: 0.3861003861003861,
        memory: 73_048_064,
        name: 'electron.exe',
        pid: 2000,
        ppid: 9176,
      },
    ])
  })
  // @ts-ignore
  WindowsProcessTree.getProcessCpuUsage.mockImplementation((list, callback) => {
    callback([
      {
        commandLine: 'C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe .',
        cpu: 0.19305019305019305,
        memory: 95_653_888,
        name: 'electron.exe',
        pid: 9176,
        ppid: 9256,
      },
      {
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=gpu-process --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --gpu-preferences=UAAAAAAAAADgAAAYAAAAAAAAAAAAAAAAAABgAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgAAAAAAAAASAAAAAAAAAAYAAAAAgAAABAAAAAAAAAAGAAAAAAAAAAQAAAAAAAAAAAAAAAOAAAAEAAAAAAAAAABAAAADgAAAAgAAAAAAAAACAAAAAAAAAA= --mojo-platform-channel-handle=1628 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:2',
        cpu: 0.19305019305019305,
        memory: 94_089_216,
        name: 'electron.exe',
        pid: 7004,
        ppid: 9176,
      },
      {
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=utility --utility-sub-type=network.mojom.NetworkService --lang=en-US --service-sandbox-type=none --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --mojo-platform-channel-handle=1832 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:8',
        cpu: 0,
        memory: 43_425_792,
        name: 'electron.exe',
        pid: 5892,
        ppid: 9176,
      },
      {
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=renderer --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path="C:\\Users\\test-user\\Documents\\app\\packages\\main-process" --enable-sandbox --lang=en-US --device-scale-factor=1 --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=4 --launch-time-ticks=3327042247 --mojo-platform-channel-handle=2184 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:1',
        cpu: 0,
        memory: 83_259_392,
        name: 'electron.exe',
        pid: 11_608,
        ppid: 9176,
      },
      {
        commandLine:
          'C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe --experimental-json-modules --max-old-space-size=60 --enable-source-maps C:\\Users\\test-user\\Documents\\app\\packages\\extension-host\\src\\extensionHostMain.js',
        cpu: 0,
        memory: 75_100_160,
        name: 'electron.exe',
        pid: 9612,
        ppid: 9176,
      },
      {
        commandLine:
          '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=renderer --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path="C:\\Users\\test-user\\Documents\\app\\packages\\main-process" --enable-sandbox --lang=en-US --device-scale-factor=1 --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=5 --launch-time-ticks=3330732877 --mojo-platform-channel-handle=3216 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:1',
        cpu: 0.3861003861003861,
        memory: 73_048_064,
        name: 'electron.exe',
        pid: 2000,
        ppid: 9176,
      },
    ])
  })
  expect(await ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(25_666)).toEqual([
    {
      cmd: 'C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe .',
      memory: 95_653_888,
      name: 'C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe .',
      pid: 9176,
      ppid: 9256,
    },
    {
      cmd: '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=gpu-process --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --gpu-preferences=UAAAAAAAAADgAAAYAAAAAAAAAAAAAAAAAABgAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgAAAAAAAAASAAAAAAAAAAYAAAAAgAAABAAAAAAAAAAGAAAAAAAAAAQAAAAAAAAAAAAAAAOAAAAEAAAAAAAAAABAAAADgAAAAgAAAAAAAAACAAAAAAAAAA= --mojo-platform-channel-handle=1628 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:2',
      memory: 94_089_216,
      name: 'gpu-process',
      pid: 7004,
      ppid: 9176,
    },
    {
      cmd: '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=utility --utility-sub-type=network.mojom.NetworkService --lang=en-US --service-sandbox-type=none --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --mojo-platform-channel-handle=1832 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:8',
      memory: 43_425_792,
      name: 'utility',
      pid: 5892,
      ppid: 9176,
    },
    {
      cmd: '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=renderer --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path="C:\\Users\\test-user\\Documents\\app\\packages\\main-process" --enable-sandbox --lang=en-US --device-scale-factor=1 --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=4 --launch-time-ticks=3327042247 --mojo-platform-channel-handle=2184 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:1',
      memory: 83_259_392,
      name: 'renderer',
      pid: 11_608,
      ppid: 9176,
    },
    {
      cmd: 'C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe --experimental-json-modules --max-old-space-size=60 --enable-source-maps C:\\Users\\test-user\\Documents\\app\\packages\\extension-host\\src\\extensionHostMain.js',
      memory: 75_100_160,
      name: 'extension-host',
      pid: 9612,
      ppid: 9176,
    },
    {
      cmd: '"C:\\Users\\test-user\\Documents\\app\\packages\\main-process\\node_modules\\electron\\dist\\electron.exe" --type=renderer --user-data-dir="C:\\Users\\test-user\\AppData\\Roaming\\main-process" --standard-schemes=lvce-oss --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path="C:\\Users\\test-user\\Documents\\app\\packages\\main-process" --enable-sandbox --lang=en-US --device-scale-factor=1 --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=5 --launch-time-ticks=3330732877 --mojo-platform-channel-handle=3216 --field-trial-handle=1380,i,10773524994372501887,514931115338394725,131072 --disable-features=SpareRendererForSitePerProcess,WinRetrieveSuggestionsOnlyOnDemand /prefetch:1',
      memory: 73_048_064,
      name: 'renderer',
      pid: 2000,
      ppid: 9176,
    },
  ])
})

test('listProcessesWithMemoryUsage - error - rootPid not found', async () => {
  // @ts-ignore
  WindowsProcessTree.getProcessList.mockImplementation((rootPid, callback) => {
    callback(undefined)
  })
  await expect(
    ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(25_666),
    // @ts-ignore
  ).rejects.toThrow(new VError('Failed to list processes: Root process 25666 not found'))
})
