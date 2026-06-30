import * as GetFilePathElectron from '../GetFilePathElectron/GetFilePathElectron.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

const getFilepath = async (file: File): Promise<string> => {
  return GetFilePathElectron.getFilePathElectron(file)
}

export const getFilePaths = async (files: readonly File[], platform: number): Promise<readonly string[]> => {
  if (platform !== PlatformType.Electron) {
    return files.map((file) => '')
  }
  const promises = files.map(getFilepath)
  const paths = await Promise.all(promises)
  return paths
}
