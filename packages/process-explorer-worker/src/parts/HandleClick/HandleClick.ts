import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as GetClickFn from '../GetClickFn/GetClickFn.ts'
import { normalizeDirentType } from '../NormalizeDirentType/NormalizeDirentType.ts'
import { resetEditing } from '../ResetEditing/ResetEditing.ts'
// TODO viewlet should only have create and refresh functions
// every thing else can be in a separate module <viewlet>.lazy.js
// and  <viewlet>.ipc.js

// viewlet: creating | refreshing | done | disposed
// TODO recycle viewlets (maybe)

// TODO instead of root string, there should be a root dirent

// TODO rename dirents to items, then can use virtual list component directly

// TODO use posInSet and setSize properties to compute more effectively

// TODO much shared logic with newFolder

export const handleClick = async (state: ExplorerState, index: number, keepFocus = false): Promise<ExplorerState> => {
  const { items } = state
  if (index === -1) {
    return FocusIndex.focusIndex(state, -1)
  }
  const actualIndex = index
  const dirent = items[actualIndex]
  if (!dirent) {
    console.warn(`[explorer] dirent at index ${actualIndex} not found`, state)
    return state
  }
  const normalizedType = normalizeDirentType(dirent.type)
  const clickFn = GetClickFn.getClickFn(normalizedType)
  const newState = await clickFn(state, dirent, actualIndex, keepFocus)
  if (newState.editingIndex === -1) {
    return newState
  }
  return {
    ...newState,
    ...resetEditing,
  }
}

// export const handleBlur=()=>{}

// TODO what happens when mouse leave and anther mouse enter event occur?
// should update preview instead of closing and reopening

// TODO maybe just insert items into explorer and refresh whole explorer
