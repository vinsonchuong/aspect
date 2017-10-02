/* @flow */
import test from 'test'
import { exec } from 'cli'

test('running and compiling JavaScript in Node', async t => {
  t.is(
    await exec(require.resolve('compiler/test/fixtures/hello'), []),
    'Hello World!'
  )
})
