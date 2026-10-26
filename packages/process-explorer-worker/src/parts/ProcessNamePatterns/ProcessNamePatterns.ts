import type { ProcessNamePattern } from '../ProcessNamePattern/ProcessNamePattern.ts'

const includesPackagePath = (cmd: string, packageName: string): boolean => {
  return (
    cmd.includes(`@lvce-editor/${packageName}/`) ||
    cmd.includes(`@lvce-editor\\${packageName}\\`)
  )
}

const sshCommandPattern =
  /^(?:"(?:[^"\n]*[/\\])?ssh(?:\.exe)?"|(?:[^\s"]*[/\\])?ssh(?:\.exe)?)(?:\s|$)/i

const wslNodeMainPattern = /(?:^|[/\\])wslNodeMain\.js(?:"|(?=\s|$))/i

export const processNamePatterns: readonly ProcessNamePattern[] = [
  {
    matches: (cmd) => sshCommandPattern.test(cmd),
    name: 'ssh',
  },
  {
    matches: (cmd) => cmd.includes('--type=zygote'),
    name: 'zygote',
  },
  {
    matches: (cmd) => cmd.includes('--type=gpu-process'),
    name: 'gpu-process',
  },
  {
    matches: (cmd) => cmd.includes('extensionHostMain.js'),
    name: 'extension-host',
  },
  {
    matches: (cmd) => includesPackagePath(cmd, 'file-system-process'),
    name: 'file-system-process',
  },
  {
    matches: (cmd) => includesPackagePath(cmd, 'file-watcher-process'),
    name: 'file-watcher-process',
  },
  {
    matches: (cmd) => includesPackagePath(cmd, 'typescript-compile-process'),
    name: 'typescript-compile-process',
  },
  {
    matches: (cmd) => cmd.includes('ptyHostMain.js'),
    name: 'pty-host',
  },
  {
    matches: (cmd) => wslNodeMainPattern.test(cmd),
    name: 'wsl',
  },
  {
    matches: (cmd) =>
      cmd.includes('--lvce-window-kind=process-explorer') ||
      includesPackagePath(cmd, 'process-explorer') ||
      cmd.includes('processExplorerMain.ts') ||
      cmd.includes('processExplorerMain.js') ||
      cmd.includes('processExplorer.js'),
    name: 'process-explorer',
  },
  {
    matches: (cmd) => cmd.includes('sharedProcessMain.js'),
    name: 'shared-process',
  },
]
