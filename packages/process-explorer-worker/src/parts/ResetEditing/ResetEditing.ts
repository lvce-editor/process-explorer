import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'

export const resetEditing = {
  editingErrorMessage: '',
  editingIcon: '',
  editingIndex: -1,
  editingSelection: {
    end: 0,
    start: 0,
  },
  editingType: ExplorerEditingType.None,
  editingValue: '',
}
