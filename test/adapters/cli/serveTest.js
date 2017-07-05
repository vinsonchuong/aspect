/* @flow */
import test from 'ava'
import { request } from 'aspect/src/lib/client'
import { spawn, kill, waitForOutput } from 'aspect/src/lib/cli'

test('manually starting the server', async t => {
  const childProcess = spawn('yarn', ['start'])
  t.context = { childProcess }

  await waitForOutput(childProcess, 'Running server')
  const match = childProcess.stdout.match(/(http:.*)/)
  if (match) {
    const url = match[1]
    const response = await request(url)
    t.true(response.includes('<!doctype html>'))
  } else {
    t.fail()
  }
})

test.afterEach(async t => {
  const { childProcess } = t.context
  await kill(childProcess)
})
