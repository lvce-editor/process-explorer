import * as Assert from '../Assert/Assert.ts'

interface ProcessNamePattern {
  readonly matches: (cmd: string) => boolean
  readonly name: string
}

const processNamePatterns: readonly ProcessNamePattern[] = [
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
    matches: (cmd) => cmd.includes('ptyHostMain.js'),
    name: 'pty-host',
  },
  {
    matches: (cmd) => cmd.includes('--lvce-window-kind=process-explorer'),
    name: 'process-explorer',
  },
]

const fallbackProcessNamePatterns: readonly ProcessNamePattern[] = [
  {
    matches: (cmd) => cmd.includes('--type=renderer'),
    name: 'renderer',
  },
  {
    matches: (cmd) => cmd.includes('--type=utility'),
    name: 'utility',
  },
  {
    matches: (cmd) => cmd.includes('tsserver.js'),
    name: 'tsserver.js',
  },
  {
    matches: (cmd) => cmd.includes('typingsInstaller.js'),
    name: 'typingsInstaller.js',
  },
  {
    matches: (cmd) => cmd.includes('extensionHostHelperProcessMain.js'),
    name: 'extension-host-helper-process',
  },
  {
    matches: (cmd) => cmd.includes('/bin/rg') || cmd.includes('rg.exe'),
    name: 'ripgrep',
  },
  {
    matches: (cmd) => cmd.startsWith('bash'),
    name: 'bash',
  },
  {
    matches: (cmd) => cmd.startsWith('/opt/sublime_text/sublime_text '),
    name: 'sublime-text',
  },
  {
    matches: (cmd) => cmd.includes('\\conhost.exe'),
    name: 'conhost.exe',
  },
]

const getPatternName = (cmd: string): string => {
  return processNamePatterns.find((pattern) => pattern.matches(cmd))?.name || ''
}

const getFallbackPatternName = (cmd: string): string => {
  return (
    fallbackProcessNamePatterns.find((pattern) => pattern.matches(cmd))?.name ||
    ''
  )
}

export const getName = (
  pid: number,
  cmd: string,
  rootPid: number,
  pidMap: Readonly<Record<number, string>>,
): string => {
  Assert.number(pid)
  Assert.string(cmd)
  Assert.number(rootPid)
  Assert.object(pidMap)
  if (pid === rootPid) {
    return 'main'
  }
  const patternName = getPatternName(cmd)
  if (patternName) {
    return patternName
  }
  if (pid in pidMap) {
    return pidMap[pid] || '<unknown>'
  }
  const fallbackPatternName = getFallbackPatternName(cmd)
  if (fallbackPatternName) {
    return fallbackPatternName
  }
  return cmd
}
