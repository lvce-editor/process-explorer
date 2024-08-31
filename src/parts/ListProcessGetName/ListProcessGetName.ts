import * as Assert from '../Assert/Assert.ts'

export const getName = (pid, cmd, rootPid, pidMap) => {
  Assert.number(pid)
  Assert.string(cmd)
  Assert.number(rootPid)
  Assert.object(pidMap)
  if (pid === rootPid) {
    return 'main'
  }
  if (cmd.includes('--type=zygote')) {
    return 'zygote'
  }
  if (cmd.includes('--type=gpu-process')) {
    return 'gpu-process'
  }
  if (cmd.includes('extensionHostMain.ts')) {
    return 'extension-host'
  }
  if (cmd.includes('ptyHostMain.ts')) {
    return 'pty-host'
  }
  if (cmd.includes('--lvce-window-kind=process-explorer')) {
    return 'process-explorer'
  }
  if (pid in pidMap) {
    return pidMap[pid] || `<unknown>`
  }
  if (cmd.includes('--type=renderer')) {
    return `renderer`
  }
  if (cmd.includes('--type=utility')) {
    return 'utility'
  }
  if (cmd.includes('tsserver.ts')) {
    return 'tsserver.ts'
  }
  if (cmd.includes('typingsInstaller.ts')) {
    return 'typingsInstaller.ts'
  }
  if (cmd.includes('extensionHostHelperProcessMain.ts')) {
    return 'extension-host-helper-process'
  }
  if (cmd.includes('/bin/rg') || cmd.includes('rg.exe')) {
    return 'ripgrep'
  }
  if (cmd.startsWith('bash')) {
    return 'bash'
  }
  if (cmd.startsWith(`/opt/sublime_text/sublime_text `)) {
    return 'sublime-text'
  }
  if (cmd.includes('\\conhost.exe')) {
    return 'conhost.exe'
  }
  return `${cmd}`
}
