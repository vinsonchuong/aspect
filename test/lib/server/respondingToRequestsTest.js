/* @flow */
import test from 'ava'
import { listen, close, subscribe } from 'aspect/src/lib/server'
import { request } from 'aspect/src/lib/client'

test.beforeEach(async t => {
  const server = await listen()
  t.context = { server }
})

test.afterEach.always(async t => {
  const { server } = t.context
  await close(server)
})

test('responding to requests', async t => {
  const { server } = t.context
  subscribe(server, request => {
    t.is(request.method, 'GET')
    t.is(request.url.href, `http://127.0.0.1:${server.port}/`)
    return `
      <!doctype html>
      <meta charset="utf-8">
    `
  })
  const response = await request(`http://127.0.0.1:${server.port}`)
  t.true(response.includes('html'))
})
