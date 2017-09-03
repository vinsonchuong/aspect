/* @flow */
import test from 'test'
import { exec } from 'cli'

test('executing a command and reading its output', async t => {
  const output = await exec('sh', ['-c', 'echo hello'])
  t.is(output, 'hello')
})