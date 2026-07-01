import type { ProcessNamePattern } from '../ProcessNamePattern/ProcessNamePattern.ts'

export const processNamePatterns: readonly ProcessNamePattern[] = [
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
