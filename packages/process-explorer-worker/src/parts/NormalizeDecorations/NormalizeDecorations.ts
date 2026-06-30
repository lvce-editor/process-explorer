import type { FileDecoration } from '../FileDecoration/FileDecoration.ts'

const isValid = (decoration: FileDecoration): boolean => {
  return decoration && typeof decoration.decoration === 'string' && typeof decoration.uri === 'string'
}

export const normalizeDecorations = (decorations: readonly FileDecoration[]): readonly FileDecoration[] => {
  if (!decorations || !Array.isArray(decorations)) {
    return []
  }
  return decorations.filter(isValid)
}
