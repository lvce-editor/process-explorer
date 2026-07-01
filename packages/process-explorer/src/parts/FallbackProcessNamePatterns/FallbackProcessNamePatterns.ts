import type { ProcessNamePattern } from '../ProcessNamePattern/ProcessNamePattern.ts'

export const fallbackProcessNamePatterns: readonly ProcessNamePattern[] = [
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
