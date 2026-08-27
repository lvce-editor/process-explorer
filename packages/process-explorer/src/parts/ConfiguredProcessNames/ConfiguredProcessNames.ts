import { readFileSync } from 'node:fs'

interface ConfiguredProcessName {
  readonly displayName: string
  readonly pathRegex: string
}

interface CompiledProcessName {
  readonly displayName: string
  readonly pathRegex: RegExp
}

const configuredProcessNames = JSON.parse(
  readFileSync(new URL('configuredProcessNames.json', import.meta.url), 'utf8'),
) as readonly ConfiguredProcessName[]

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
