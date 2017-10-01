/* @flow */
import test from 'test'
import { compileAndRun } from 'compiler'

test('running and compiling JavaScript in Node', t => {
  compileAndRun('compiler/test/fixtures/hello')
  t.is(global.someVariable, 'Hello World!')
})
