/* @flow */
import test from 'test'
import * as path from 'path'
import { exec, execToTerminal } from 'cli'

test('executing a command and reading its output', async t => {
  const output = await exec('sh', ['-c', 'echo hello'])
  t.is(output, 'hello')
})

test('executing a command and outputting to the terminal', async t => {
  const output = await exec(require.resolve('cli/test/fixtures/hello'), [])
  t.is(output, 'hello')
})

test('executing a command to the terminal and returning the exit code', async t => {
  t.is(await execToTerminal('sh', ['-c', 'true']), 0)
  t.is(await execToTerminal('sh', ['-c', 'false']), 1)
})

test('executing a command to the terminal with a specific working directory', async t => {
  const scriptPath = require.resolve('cli/test/fixtures/printThisDirectory')

  const output = await exec(scriptPath, [])
  t.is(output, path.dirname(scriptPath))
})
