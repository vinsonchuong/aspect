/* @flow */
import test from 'ava'
import { makeRequest } from 'transport'
import { spawn, kill, waitForOutput } from 'cli'

test('manually starting the server', async t => {
  const childProcess = spawn('yarn', ['start'])
  t.context = { childProcess }

  await waitForOutput(childProcess, 'Running server')
  const match = childProcess.stdout.match(/(http:.*)/)

  if (!match) {
    t.fail()
    return
  }

  const response = await makeRequest({
    method: 'GET',
    url: match[1],
    headers: {},
    body: Buffer.from('')
  })

  t.true(response.body.includes('<!doctype html>'))
})

test.afterEach(async t => {
  const { childProcess } = t.context
  await kill(childProcess)
})
