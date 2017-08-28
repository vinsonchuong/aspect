/* @flow */
import test from 'test'
import { cache } from 'middleware'

const uncachedRequest = {
  method: 'GET',
  url: '/',
  headers: {},
  body: Buffer.from('')
}

const cachedRequest = {
  method: 'GET',
  url: '/',
  headers: {
    'If-Modified-Since': new Date('2017-01-01').toUTCString()
  },
  body: Buffer.from('')
}

const staleResponse = {
  status: 200,
  headers: {
    'Content-Type': 'text/plain',
    'Last-Modified': new Date('2016-12-31').toUTCString()
  },
  body: Buffer.from('content')
}

const freshResponse = {
  status: 200,
  headers: {
    'Content-Type': 'text/plain',
    'Last-Modified': new Date('2017-01-02').toUTCString()
  },
  body: Buffer.from('content')
}

const errorResponse = {
  status: 404,
  headers: {},
  body: Buffer.from('')
}

test('sending the response body when the client has not cached it', t => {
  const result = cache(uncachedRequest, freshResponse)
  t.is(result.status, 200)
  t.is(result.headers['Content-Type'], 'text/plain')
  t.true(result.body.includes('content'))
})

test('not sending the response body when the client has cached it', t => {
  const result = cache(cachedRequest, staleResponse)
  t.is(result.status, 304)
  t.false('Content-Type' in result.headers)
  t.true('Last-Modified' in result.headers)
  t.is(result.body.byteLength, 0)
})

test('sending the response body when the client has cached a stale version', t => {
  const result = cache(cachedRequest, freshResponse)
  t.is(result.status, 200)
  t.true(result.body.includes('content'))
})

test('sending the response if it is an error', t => {
  const result = cache(cachedRequest, errorResponse)
  t.is(result.status, 404)
})
