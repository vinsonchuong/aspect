/* @flow */
import test from 'test'
import { getRunningProcesses, spawn, waitForOutput, kill } from 'cli'

test('spawning a process', async t => {
  const script = 'sleep 1; echo text; sleep 100'
  const shell = spawn('sh', ['-c', script])
  await waitForOutput(shell, 'text')

  t.true(await runningProcessesInclude(`sh -c ${script}`))

  await kill(shell)
  t.false(await runningProcessesInclude(`sh -c ${script}`))
})

async function runningProcessesInclude(command: string): Promise<boolean> {
  const runningProcesses = await getRunningProcesses()
  return runningProcesses.some(
    runningProcess => runningProcess.command === command
  )
}
