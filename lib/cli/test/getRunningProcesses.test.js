/* @flow */
import test from 'ava'
import { spawn, getRunningProcesses } from 'cli'

test('listing the currently running processes', async t => {
  const sh1 = spawn('sh', ['-c', 'sleep 1'])
  const sh2 = spawn('sh', ['-c', 'sleep 2'])
  const runningProcesses = await getRunningProcesses()
  t.true(
    runningProcesses.some(
      ({ pid, command }) => pid === sh1.pid && command.includes('sleep 1')
    )
  )
  t.true(
    runningProcesses.some(
      ({ pid, command }) => pid === sh2.pid && command.includes('sleep 2')
    )
  )
})
