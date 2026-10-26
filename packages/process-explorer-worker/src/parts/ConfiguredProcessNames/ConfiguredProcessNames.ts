import configuredProcessNames from './configuredProcessNames.json' with { type: 'json' }

interface CompiledProcessName {
  readonly displayName: string
  readonly pathRegex: RegExp
}

const compiledProcessNames: readonly CompiledProcessName[] =
  configuredProcessNames.map(({ displayName, pathRegex }) => ({
    displayName,
    pathRegex: new RegExp(pathRegex),
  }))

export const getConfiguredProcessName = (cmd: string): string => {
  return (
    compiledProcessNames.find(({ pathRegex }) => pathRegex.test(cmd))
      ?.displayName || ''
  )
}
