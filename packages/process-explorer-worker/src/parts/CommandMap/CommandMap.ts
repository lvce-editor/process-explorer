import { terminate } from '@lvce-editor/viewlet-registry'
import * as AcceptEdit from '../AcceptEdit/AcceptEdit.ts'
import * as CancelEdit from '../CancelEdit/CancelEdit.ts'
import * as CancelTypeAhead from '../CancelTypeAhead/CancelTypeAhead.ts'
import * as CollapseAll from '../CollapseAll/CollapseAll.ts'
import * as CompareWithSelected from '../CompareWithSelected/CompareWithSelected.ts'
import * as CopyPath from '../CopyPath/CopyPath.ts'
import * as CopyRelativePath from '../CopyRelativePath/CopyRelativePath.ts'
import * as Create2 from '../Create2/Create2.ts'
import * as Create from '../Create/Create.ts'
import * as Diff2 from '../Diff2/Diff2.ts'
import * as ExpandAll from '../ExpandAll/ExpandAll.ts'
import * as ExpandRecursively from '../ExpandRecursively/ExpandRecursively.ts'
import * as WrapCommand from '../ExplorerStates/ExplorerStates.ts'
import * as Focus from '../Focus/Focus.ts'
import * as FocusFirst from '../FocusFirst/FocusFirst.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as FocusLast from '../FocusLast/FocusLast.ts'
import * as FocusNext from '../FocusNext/FocusNext.ts'
import * as FocusNone from '../FocusNone/FocusNone.ts'
import * as FocusPrevious from '../FocusPrevious/FocusPrevious.ts'
import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as GetMenuEntries2 from '../GetMenuEntries2/GetMenuEntries2.ts'
import * as GetMenuEntries from '../GetMenuEntries/GetMenuEntries.ts'
import * as GetMouseActions from '../GetMouseActions/GetMouseActions.ts'
import * as HandleArrowLeft from '../HandleArrowLeft/HandleArrowLeft.ts'
import * as HandleArrowRight from '../HandleArrowRight/HandleArrowRight.ts'
import * as HandleBlur from '../HandleBlur/HandleBlur.ts'
import { handleButtonClick } from '../HandleButtonClick/HandleButtonClick.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleClickAt from '../HandleClickAt/HandleClickAt.ts'
import * as HandleClickCurrent from '../HandleClickCurrent/HandleClickCurrent.ts'
import * as HandleClickCurrentButKeepFocus from '../HandleClickCurrentButKeepFocus/HandleClickCurrentButKeepFocus.ts'
import * as HandleClickOpenFolder from '../HandleClickOpenFolder/HandleClickOpenFolder.ts'
import * as HandleContextMenu from '../HandleContextMenu/HandleContextMenu.ts'
import * as HandleContextMenuKeyboard from '../HandleContextMenuKeyboard/HandleContextMenuKeyboard.ts'
import * as HandleContextMenuWelcome from '../HandleContextMenuWelcome/HandleContextMenuWelcome.ts'
import * as HandleCopy from '../HandleCopy/HandleCopy.ts'
import * as HandleCut from '../HandleCut/HandleCut.ts'
import { handleDoubleClick } from '../HandleDoubleClick/HandleDoubleClick.ts'
import { handleDragEnd } from '../HandleDragEnd/HandleDragEnd.ts'
import * as HandleDragLeave from '../HandleDragLeave/HandleDragLeave.ts'
import * as HandleDragOver from '../HandleDragOver/HandleDragOver.ts'
import * as HandleDragOverIndex from '../HandleDragOverIndex/HandleDragOverIndex.ts'
import * as HandleDragStart from '../HandleDragStart/HandleDragStart.ts'
import * as HandleDrop from '../HandleDrop/HandleDrop.ts'
import { handleDropIndex } from '../HandleDropIndex/HandleDropIndex.ts'
import { handleEscape } from '../HandleEscape/HandleEscape.ts'
import * as HandleFocus from '../HandleFocus/HandleFocus.ts'
import * as HandleIconThemeChange from '../HandleIconThemeChange/HandleIconThemeChange.ts'
import * as HandleInputBlur from '../HandleInputBlur/HandleInputBlur.ts'
import * as HandleInputClick from '../HandleInputClick/HandleInputClick.ts'
import * as HandleInputKeyDown from '../HandleInputKeyDown/HandleInputKeyDown.ts'
import * as HandleKeyDown from '../HandleKeyDown/HandleKeyDown.ts'
import * as HandlePaste from '../HandlePaste/HandlePaste.ts'
import * as HandlePointerDown from '../HandlePointerDown/HandlePointerDown.ts'
import * as HandleResize from '../HandleResize/HandleResize.ts'
import * as HandleUpload from '../HandleUpload/HandleUpload.ts'
import * as HandleWheel from '../HandleWheel/HandleWheel.ts'
import * as HandleWorkspaceChange from '../HandleWorkspaceChange/HandleWorkspaceChange.ts'
import { handleWorkspaceRefresh } from '../HandleWorkspaceRefresh/HandleWorkspaceRefresh.ts'
import * as Initialize from '../Initialize/Initialize.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as NewFile from '../NewFile/NewFile.ts'
import * as NewFolder from '../NewFolder/NewFolder.ts'
import * as OpenContainingFolder from '../OpenContainingFolder/OpenContainingFolder.ts'
import * as Refresh from '../Refresh/Refresh.ts'
import * as RemoveDirent from '../RemoveDirent/RemoveDirent.ts'
import * as RenameDirent from '../RenameDirent/RenameDirent.ts'
import * as Render2 from '../Render2/Render2.ts'
import * as RenderActions2 from '../RenderActions2/RenderActions2.ts'
import * as RenderEventListeners from '../RenderEventListeners/RenderEventListeners.ts'
import * as RestoreState from '../RestoreState/RestoreState.ts'
import * as RevealItem from '../RevealItem/RevealItem.ts'
import * as SaveState from '../SaveState/SaveState.ts'
import * as SelectAll from '../SelectAll/SelectAll.ts'
import * as SelectDown from '../SelectDown/SelectDown.ts'
import * as SelectForCompare from '../SelectForCompare/SelectForCompare.ts'
import * as SelectIndices from '../SelectIndices/SelectIndices.ts'
import * as SelectUp from '../SelectUp/SelectUp.ts'
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'
import * as ToggleIndividualSelection from '../ToggleIndividualSelection/ToggleIndividualSelection.ts'
import * as UpdateEditingValue from '../UpdateEditingValue/UpdateEditingValue.ts'
import * as UpdateIcons from '../UpdateIcons/UpdateIcons.ts'

export const commandMap = {
  'Explorer.acceptEdit': WrapCommand.wrapListItemCommand(AcceptEdit.acceptEdit),
  'Explorer.cancelEdit': WrapCommand.wrapListItemCommand(CancelEdit.cancelEdit),
  'Explorer.cancelTypeAhead': WrapCommand.wrapListItemCommand(CancelTypeAhead.cancelTypeAhead),
  'Explorer.collapseAll': WrapCommand.wrapListItemCommand(CollapseAll.collapseAll),
  'Explorer.compareWithSelected': WrapCommand.wrapListItemCommand(CompareWithSelected.compareWithSelected),
  'Explorer.copyPath': WrapCommand.wrapListItemCommand(CopyPath.copyPath),
  'Explorer.copyRelativePath': WrapCommand.wrapListItemCommand(CopyRelativePath.copyRelativePath),
  'Explorer.create': Create.create,
  // not wrapped
  'Explorer.create2': Create2.create2,
  'Explorer.diff2': Diff2.diff2,
  'Explorer.expandAll': WrapCommand.wrapListItemCommand(ExpandAll.expandAll),
  'Explorer.expandRecursively': WrapCommand.wrapListItemCommand(ExpandRecursively.expandRecursively),
  'Explorer.focus': WrapCommand.wrapListItemCommand(Focus.focus),
  'Explorer.focusFirst': WrapCommand.wrapListItemCommand(FocusFirst.focusFirst),
  'Explorer.focusIndex': WrapCommand.wrapListItemCommand(FocusIndex.focusIndex),
  'Explorer.focusLast': WrapCommand.wrapListItemCommand(FocusLast.focusLast),
  'Explorer.focusNext': WrapCommand.wrapListItemCommand(FocusNext.focusNext),
  'Explorer.focusNone': WrapCommand.wrapListItemCommand(FocusNone.focusNone),
  'Explorer.focusPrevious': WrapCommand.wrapListItemCommand(FocusPrevious.focusPrevious),
  'Explorer.getCommandIds': WrapCommand.getCommandIds,
  'Explorer.getKeyBindings': GetKeyBindings.getKeyBindings,
  'Explorer.getMenuEntries': GetMenuEntries.getMenuEntries,
  'Explorer.getMenuEntries2': WrapCommand.wrapGetter(GetMenuEntries2.getMenuEntries2),
  'Explorer.getMouseActions': GetMouseActions.getMouseActions,
  'Explorer.handleArrowLeft': WrapCommand.wrapListItemCommand(HandleArrowLeft.handleArrowLeft),
  'Explorer.handleArrowRight': WrapCommand.wrapListItemCommand(HandleArrowRight.handleArrowRight),
  'Explorer.handleBlur': WrapCommand.wrapListItemCommand(HandleBlur.handleBlur),
  'Explorer.handleButtonClick': WrapCommand.wrapListItemCommand(handleButtonClick),
  'Explorer.handleClick': WrapCommand.wrapListItemCommand(HandleClick.handleClick),
  'Explorer.handleClickAt': WrapCommand.wrapListItemCommand(HandleClickAt.handleClickAt),
  'Explorer.handleClickCurrent': WrapCommand.wrapListItemCommand(HandleClickCurrent.handleClickCurrent),
  'Explorer.handleClickCurrentButKeepFocus': WrapCommand.wrapListItemCommand(HandleClickCurrentButKeepFocus.handleClickCurrentButKeepFocus),
  'Explorer.handleClickOpenFolder': WrapCommand.wrapListItemCommand(HandleClickOpenFolder.handleClickOpenFolder),
  'Explorer.handleContextMenu': WrapCommand.wrapListItemCommand(HandleContextMenu.handleContextMenu),
  'Explorer.handleContextMenuKeyboard': WrapCommand.wrapListItemCommand(HandleContextMenuKeyboard.handleContextMenuKeyboard),
  'Explorer.handleContextMenuWelcome': WrapCommand.wrapListItemCommand(HandleContextMenuWelcome.handleContextMenuWelcome),
  'Explorer.handleCopy': WrapCommand.wrapListItemCommand(HandleCopy.handleCopy),
  'Explorer.handleCut': WrapCommand.wrapListItemCommand(HandleCut.handleCut),
  'Explorer.handleDoubleClick': WrapCommand.wrapListItemCommand(handleDoubleClick),
  'Explorer.handleDragEnd': WrapCommand.wrapListItemCommand(handleDragEnd),
  'Explorer.handleDragLeave': WrapCommand.wrapListItemCommand(HandleDragLeave.handleDragLeave),
  'Explorer.handleDragOver': WrapCommand.wrapListItemCommand(HandleDragOver.handleDragOver),
  'Explorer.handleDragOverIndex': WrapCommand.wrapListItemCommand(HandleDragOverIndex.handleDragOverIndex),
  'Explorer.handleDragStart': WrapCommand.wrapListItemCommand(HandleDragStart.handleDragStart),
  'Explorer.handleDrop': WrapCommand.wrapListItemCommand(HandleDrop.handleDrop),
  'Explorer.handleDropIndex': WrapCommand.wrapListItemCommand(handleDropIndex),
  'Explorer.handleEscape': WrapCommand.wrapListItemCommand(handleEscape),
  'Explorer.handleFocus': WrapCommand.wrapListItemCommand(HandleFocus.handleFocus),
  'Explorer.handleIconThemeChange': WrapCommand.wrapListItemCommand(HandleIconThemeChange.handleIconThemeChange),
  'Explorer.handleInputBlur': WrapCommand.wrapListItemCommand(HandleInputBlur.handleInputBlur),
  'Explorer.handleInputClick': WrapCommand.wrapListItemCommand(HandleInputClick.handleInputClick),
  'Explorer.handleInputKeyDown': WrapCommand.wrapListItemCommand(HandleInputKeyDown.handleInputKeyDown),
  'Explorer.handleKeyDown': WrapCommand.wrapListItemCommand(HandleKeyDown.handleKeyDown),
  'Explorer.handlePaste': WrapCommand.wrapListItemCommand(HandlePaste.handlePaste),
  'Explorer.handlePointerDown': WrapCommand.wrapListItemCommand(HandlePointerDown.handlePointerDown),
  'Explorer.handleResize': WrapCommand.wrapListItemCommand(HandleResize.handleResize),
  'Explorer.handleUpload': WrapCommand.wrapListItemCommand(HandleUpload.handleUpload),
  'Explorer.handleWheel': WrapCommand.wrapListItemCommand(HandleWheel.handleWheel),
  'Explorer.handleWorkspaceChange': WrapCommand.wrapListItemCommand(HandleWorkspaceChange.handleWorkspaceChange),
  'Explorer.handleWorkspaceRefresh': WrapCommand.wrapListItemCommand(handleWorkspaceRefresh),
  'Explorer.initialize': Initialize.initialize,
  'Explorer.loadContent': WrapCommand.wrapListItemCommand(LoadContent.loadContent),
  'Explorer.newFile': WrapCommand.wrapListItemCommand(NewFile.newFile),
  'Explorer.newFolder': WrapCommand.wrapListItemCommand(NewFolder.newFolder),
  'Explorer.openContainingFolder': WrapCommand.wrapListItemCommand(OpenContainingFolder.openContainingFolder),
  'Explorer.refresh': WrapCommand.wrapListItemCommand(Refresh.refresh),
  'Explorer.removeDirent': WrapCommand.wrapListItemCommand(RemoveDirent.removeDirent),
  'Explorer.renameDirent': WrapCommand.wrapListItemCommand(RenameDirent.renameDirent),
  'Explorer.render2': Render2.render2,
  'Explorer.renderActions2': RenderActions2.renderActions,
  'Explorer.renderEventListeners': RenderEventListeners.renderEventListeners,
  'Explorer.restoreState': RestoreState.restoreState,
  'Explorer.reveal': WrapCommand.wrapListItemCommand(RevealItem.revealItem),
  'Explorer.revealItem': WrapCommand.wrapListItemCommand(RevealItem.revealItem),

  'Explorer.saveState': WrapCommand.wrapGetter(SaveState.saveState),
  'Explorer.selectAll': WrapCommand.wrapListItemCommand(SelectAll.selectAll),
  'Explorer.selectDown': WrapCommand.wrapListItemCommand(SelectDown.selectDown),
  'Explorer.selectForCompare': WrapCommand.wrapListItemCommand(SelectForCompare.selectForCompare),
  'Explorer.selectIndices': WrapCommand.wrapListItemCommand(SelectIndices.setSelectedIndices),
  'Explorer.selectUp': WrapCommand.wrapListItemCommand(SelectUp.selectUp),
  'Explorer.setDeltaY': WrapCommand.wrapListItemCommand(SetDeltaY.setDeltaY),
  'Explorer.setSelectedIndices': WrapCommand.wrapListItemCommand(SelectIndices.setSelectedIndices),
  'Explorer.terminate': terminate,
  'Explorer.toggleIndividualSelection': WrapCommand.wrapListItemCommand(ToggleIndividualSelection.toggleIndividualSelection),
  'Explorer.updateEditingValue': WrapCommand.wrapListItemCommand(UpdateEditingValue.updateEditingValue),

  'Explorer.updateIcons': WrapCommand.wrapListItemCommand(UpdateIcons.updateIcons),
}
