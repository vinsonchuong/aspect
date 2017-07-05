/* @flow */
import test from 'ava'
import { exec } from 'aspect/src/lib/cli'

test('executing a command and reading its output', async t => {
  const output = await exec('sh', ['-c', 'echo hello'])
  t.is(output, 'hello')
})
