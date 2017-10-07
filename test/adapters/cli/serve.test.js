/* @flow */
import test from 'ava'
import { connect, disconnect, sendRequest } from 'transport'
import { spawn, kill, waitForOutput } from 'cli'

test('manually starting the server', async t => {
  const childProcess = spawn('yarn', ['start'])
  t.context = { childProcess }

  await waitForOutput(childProcess, 'Running server')
  const match = childProcess.stdout.match(/https:\/\/(.*)/)

  if (!match) {
    t.fail()
    return
  }

  const session = connect(match[1])
  const response = await sendRequest(session, {
    method: 'GET',
    url: '/',
    headers: {},
    body: Buffer.from('')
  })
  await disconnect(session)

  t.true(response.body.includes('<!doctype html>'))
})

test.afterEach(async t => {
  const { childProcess } = t.context
  await kill(childProcess)
})
