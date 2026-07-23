import { terminate } from '@lvce-editor/viewlet-registry'
import * as CollapseAll from '../CollapseAll/CollapseAll.ts'
import * as Create from '../Create/Create.ts'
import * as DebugProcess from '../DebugProcess/DebugProcess.ts'
import * as Diff2 from '../Diff2/Diff2.ts'
import * as Dispose from '../Dispose/Dispose.ts'
import * as E2eFixtureProcess from '../E2eFixtureProcess/E2eFixtureProcess.ts'
import * as ExpandAll from '../ExpandAll/ExpandAll.ts'
import * as FocusFirst from '../FocusFirst/FocusFirst.ts'
import * as FocusLast from '../FocusLast/FocusLast.ts'
import * as FocusNext from '../FocusNext/FocusNext.ts'
import * as FocusPrevious from '../FocusPrevious/FocusPrevious.ts'
import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as GetMenuEntries from '../GetMenuEntries/GetMenuEntries.ts'
import * as GetMenuEntryIds from '../GetMenuEntryIds/GetMenuEntryIds.ts'
import * as HandleArrowLeft from '../HandleArrowLeft/HandleArrowLeft.ts'
import * as HandleArrowRight from '../HandleArrowRight/HandleArrowRight.ts'
import * as HandleBlur from '../HandleBlur/HandleBlur.ts'
import * as HandleClickAt from '../HandleClickAt/HandleClickAt.ts'
import * as HandleContextMenu from '../HandleContextMenu/HandleContextMenu.ts'
import * as HandleDoubleClick from '../HandleDoubleClick/HandleDoubleClick.ts'
import * as HandleFocus from '../HandleFocus/HandleFocus.ts'
import * as KillProcess from '../KillProcess/KillProcess.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'
import * as Refresh from '../Refresh/Refresh.ts'
import * as Render2 from '../Render2/Render2.ts'
import * as RenderEventListeners from '../RenderEventListeners/RenderEventListeners.ts'
import * as SetError from '../SetError/SetError.ts'
import * as SetRootProcessId from '../SetRootProcessId/SetRootProcessId.ts'
import * as SetUpdateInterval from '../SetUpdateInterval/SetUpdateInterval.ts'

export const commandMap = {
  'ProcessExplorer.collapseAll': ProcessExplorerStates.wrapCommand(
    CollapseAll.collapseAll,
  ),
  'ProcessExplorer.create': Create.create,
  'ProcessExplorer.createE2eFixtureProcess': ProcessExplorerStates.wrapCommand(
    E2eFixtureProcess.createE2eFixtureProcess,
  ),
  'ProcessExplorer.debugProcess': ProcessExplorerStates.wrapCommand(
    DebugProcess.debugProcess,
  ),
  'ProcessExplorer.diff2': Diff2.diff2,
  'ProcessExplorer.dispose': Dispose.dispose,
  'ProcessExplorer.disposeE2eFixtureProcess':
    E2eFixtureProcess.disposeE2eFixtureProcess,
  'ProcessExplorer.expandAll': ProcessExplorerStates.wrapCommand(
    ExpandAll.expandAll,
  ),
  'ProcessExplorer.focusFirst': ProcessExplorerStates.wrapCommand(
    FocusFirst.focusFirst,
  ),
  'ProcessExplorer.focusLast': ProcessExplorerStates.wrapCommand(
    FocusLast.focusLast,
  ),
  'ProcessExplorer.focusNext': ProcessExplorerStates.wrapCommand(
    FocusNext.focusNext,
  ),
  'ProcessExplorer.focusPrevious': ProcessExplorerStates.wrapCommand(
    FocusPrevious.focusPrevious,
  ),
  'ProcessExplorer.getCommandIds': ProcessExplorerStates.getCommandIds,
  'ProcessExplorer.getKeyBindings': GetKeyBindings.getKeyBindings,
  'ProcessExplorer.getMenuEntries': ProcessExplorerStates.wrapGetter(
    GetMenuEntries.getMenuEntries,
  ),
  'ProcessExplorer.getMenuEntryIds': GetMenuEntryIds.getMenuEntryIds,
  'ProcessExplorer.handleArrowLeft': ProcessExplorerStates.wrapCommand(
    HandleArrowLeft.handleArrowLeft,
  ),
  'ProcessExplorer.handleArrowRight': ProcessExplorerStates.wrapCommand(
    HandleArrowRight.handleArrowRight,
  ),
  'ProcessExplorer.handleBlur': ProcessExplorerStates.wrapCommand(
    HandleBlur.handleBlur,
  ),
  'ProcessExplorer.handleClickAt': ProcessExplorerStates.wrapCommand(
    HandleClickAt.handleClickAt,
  ),
  'ProcessExplorer.handleContextMenu': ProcessExplorerStates.wrapCommand(
    HandleContextMenu.handleContextMenu,
  ),
  'ProcessExplorer.handleDoubleClick': ProcessExplorerStates.wrapCommand(
    HandleDoubleClick.handleDoubleClick,
  ),
  'ProcessExplorer.handleFocus': ProcessExplorerStates.wrapCommand(
    HandleFocus.handleFocus,
  ),
  'ProcessExplorer.killProcess': ProcessExplorerStates.wrapCommand(
    KillProcess.killProcess,
  ),
  'ProcessExplorer.loadContent': ProcessExplorerStates.wrapLoadContent(
    LoadContent.loadContent,
  ),
  'ProcessExplorer.refresh': ProcessExplorerStates.wrapCommand(Refresh.refresh),
  'ProcessExplorer.render2': Render2.render2,
  'ProcessExplorer.renderEventListeners':
    RenderEventListeners.renderEventListeners,
  'ProcessExplorer.setError': ProcessExplorerStates.wrapCommand(
    SetError.setError,
  ),
  'ProcessExplorer.setRootProcessId': ProcessExplorerStates.wrapCommand(
    SetRootProcessId.setRootProcessId,
  ),
  'ProcessExplorer.setUpdateInterval': ProcessExplorerStates.wrapCommand(
    SetUpdateInterval.setUpdateInterval,
  ),
  'ProcessExplorer.terminate': terminate,
  'ProcessExplorer.update': ProcessExplorerStates.wrapCommand(Refresh.refresh),
}
