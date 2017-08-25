/* @flow */
import test from 'ava'
import { compileNpm } from 'compiler'

test('compiling npm packages to ES modules', async t => {
  const compiledCode = await compileNpm('react')
  t.true(compiledCode.includes('export default react'))
})
