/* @flow */
import test from 'ava'
import * as path from 'path'
import { stat } from 'file'

test('reading metadata for a file', async t => {
  const stats = await stat(path.resolve('package.json'))
  if (!stats) {
    return t.fail()
  }
  t.true(stats.isFile())
})

test('reading metadata for a file that does not exist', async t => {
  const stats = await stat(path.resolve('nonexisting'))
  t.is(stats, null)
})
