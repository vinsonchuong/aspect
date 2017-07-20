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

    return {
      content: `
        <!doctype html>
        <meta charset="utf-8">
      `,
      type: 'html',
      modified: new Date('2017-04-01')
    }
  })
  const response = await request({
    method: 'GET',
    url: `http://127.0.0.1:${server.port}`
  })
  if (response.status !== 'OK') {
    t.fail()
    return
  }

  t.true(response.content.includes('html'))
  t.is(response.type, 'html')
  t.deepEqual(response.modified, new Date('2017-04-01'))
})

test('responding to requests for unmodified content', async t => {
  const { server } = t.context
  subscribe(server, request => ({
    content: `
    <!doctype html>
    <meta charset="utf-8">
    `,
    type: 'html',
    modified: new Date('2017-04-01')
  }))

  const response = await request({
    method: 'GET',
    url: `http://127.0.0.1:${server.port}`,
    modified: new Date('2017-04-01')
  })

  t.is(response.status, 'Not Modified')
})
