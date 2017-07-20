/* @flow */
import test from 'ava'
import { request } from 'aspect/src/lib/client'
import { spawn, kill, waitForOutput } from 'aspect/src/lib/cli'

test('manually starting the server', async t => {
  const childProcess = spawn('yarn', ['start'])
  t.context = { childProcess }

  await waitForOutput(childProcess, 'Running server')
  const match = childProcess.stdout.match(/(http:.*)/)

  if (!match) {
    t.fail()
    return
  }

  const response = await request({ method: 'GET', url: match[1] })

  if (response.status !== 'OK') {
    t.fail()
    return
  }

  t.true(response.content.includes('<!doctype html>'))
})

test.afterEach(async t => {
  const { childProcess } = t.context
  await kill(childProcess)
})
