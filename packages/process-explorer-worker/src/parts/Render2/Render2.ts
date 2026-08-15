import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const render2 = (
  uid: number,
  diffResult: readonly number[],
): readonly any[] | Promise<readonly any[]> => {
  const { oldState, scheduledState } = ProcessExplorerStates.get(uid)
  ProcessExplorerStates.set(uid, scheduledState, scheduledState)
  const commands = ApplyRender.applyRender(oldState, scheduledState, diffResult)
  if (!RendererProcess.isConnected()) return commands
  return renderDirect(uid, commands)
}

const renderDirect = async (uid: number, commands: readonly any[]): Promise<readonly any[]> => {
  const rendererWorkerCommands = commands.filter((command) => command[0] === 'Viewlet.setFocusContext')
  const rendererProcessCommands = commands.filter((command) => command[0] !== 'Viewlet.setFocusContext')
  const transactionId = await RendererProcess.invoke('Viewlet.queueCommands', uid, rendererProcessCommands)
  return [...rendererWorkerCommands, ['Viewlet.commitPending', uid, transactionId]]
}
