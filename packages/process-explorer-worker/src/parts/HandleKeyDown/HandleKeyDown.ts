import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { cancelTypeAhead } from '../CancelTypeAhead/CancelTypeAhead.ts'
import { filterByFocusWord } from '../FilterByFocusWord/FilterByFocusWord.ts'
import { isAscii } from '../IsAscii/IsAscii.ts'

const typeAheadTimeout: { value?: ReturnType<typeof setTimeout> } = {}

export const handleKeyDown = (state: ExplorerState, key: string): ExplorerState => {
  const { focusedIndex, focusWord, focusWordTimeout, items } = state
  if (focusWord && key === '') {
    return cancelTypeAhead(state)
  }
  if (!isAscii(key)) {
    return state
  }

  const newFocusWord = focusWord + key.toLowerCase()
  const itemNames = items.map((item) => item.name)
  const matchingIndex = filterByFocusWord(itemNames, focusedIndex, newFocusWord)

  if (typeAheadTimeout.value) {
    clearTimeout(typeAheadTimeout.value)
  }

  typeAheadTimeout.value = setTimeout(() => {
    void RendererWorker.invoke('Explorer.cancelTypeAhead')
  }, focusWordTimeout)

  if (matchingIndex === -1) {
    return {
      ...state,
      focusWord: newFocusWord,
    }
  }

  return {
    ...state,
    focusedIndex: matchingIndex,
    focusWord: newFocusWord,
  }
}
