import * as Path from '../Path/Path.ts'

export const generateUniqueName = (baseName: string, existingPaths: readonly string[], root: string): string => {
  // Handle files with extensions
  const lastDotIndex = baseName.lastIndexOf('.')
  const hasExtension = lastDotIndex !== -1 && lastDotIndex !== 0 && lastDotIndex !== baseName.length - 1

  let nameWithoutExtension: string
  let extension: string

  if (hasExtension) {
    nameWithoutExtension = baseName.slice(0, lastDotIndex)
    extension = baseName.slice(lastDotIndex)
  } else {
    nameWithoutExtension = baseName
    extension = ''
  }

  // Check if original name exists
  const originalPath = Path.join2(root, baseName)
  if (!existingPaths.includes(originalPath)) {
    return baseName
  }

  // Try "original copy"
  const copyName = `${nameWithoutExtension} copy${extension}`
  const copyPath = Path.join2(root, copyName)
  if (!existingPaths.includes(copyPath)) {
    return copyName
  }

  // Try "original copy 1", "original copy 2", etc.
  let counter = 1
  while (true) {
    const numberedCopyName = `${nameWithoutExtension} copy ${counter}${extension}`
    const numberedCopyPath = Path.join2(root, numberedCopyName)
    if (!existingPaths.includes(numberedCopyPath)) {
      return numberedCopyName
    }
    counter++
  }
}
