import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as Path from '../Path/Path.ts'

const trimTrailingPathSeparators = (path: string): string => {
  let end = path.length
  while (end > 0 && (path[end - 1] === '/' || path[end - 1] === '\\')) {
    end--
  }
  return path.slice(0, end)
}

export const validateFolderCopy = (sourcePath: string, targetPath: string): string | null => {
  // Remove trailing separators for comparison
  const normalizedSource = trimTrailingPathSeparators(sourcePath)
  const normalizedTarget = trimTrailingPathSeparators(targetPath)

  // Check if the target path is a subfolder of the source path
  if (normalizedTarget.startsWith(normalizedSource + '/') || normalizedTarget.startsWith(normalizedSource + '\\')) {
    // Extract folder name using the appropriate path separator
    const pathSeparator = normalizedSource.includes('\\') ? '\\' : '/'
    const folderName = Path.getBaseName(pathSeparator, normalizedSource)
    return ExplorerStrings.cannotCopyFolderIntoSubfolderOfItself(folderName)
  }

  return null
}
