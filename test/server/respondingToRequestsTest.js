/* @flow */
import test from 'ava'
import getPort from 'get-port'
import fetch from 'node-fetch'
import { listen, close, subscribe } from 'aspect/src/server'

test.beforeEach(async t => {
  const port = await getPort()
  const server = await listen(port)
  t.context = { server, port }
})

test.afterEach.always(async t => {
  const { server } = t.context
  await close(server)
})

test('responding to requests', async t => {
  const { server, port } = t.context
  subscribe(server, request => {
    t.is(request.method, 'GET')
    t.is(request.url.pathname, '/')
    return `
      <!doctype html>
      <meta charset="utf-8">
    `
  })
  const response = await request(`http://127.0.0.1:${port}`)
  t.true(response.includes('html'))
})

async function request(url: string): Promise<string> {
  const response = await fetch(url)
  return response.text()
}
