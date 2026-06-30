import { DELTA_EDITING } from '../DeltaEditing/DeltaEditing.ts'

export const normalizeDirentType = (direntType: number): number => {
  if (direntType > DELTA_EDITING) {
    return direntType - DELTA_EDITING
  }
  return direntType
}
