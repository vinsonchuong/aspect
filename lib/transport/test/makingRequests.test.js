/* @flow */
import test from 'test'
import { makeRequest } from 'transport'

test('making an HTTP GET request', async t => {
  const response = await makeRequest({
    method: 'GET',
    url: 'http://example.com/',
    headers: {},
    body: Buffer.from('')
  })

  t.is(response.status, 200)

  t.is(response.headers['Content-Encoding'], 'gzip')
  t.is(response.headers['Content-Type'], 'text/html')
  t.is(response.headers['Content-Length'], '606')

  t.true(response.body && response.body.includes('<!doctype html>'))
})

test('making an HTTP POST request', async t => {
  const response = await makeRequest({
    method: 'POST',
    url: 'http://httpbin.org/post',
    headers: {},
    body: Buffer.from('{"hello": "world!"}')
  })

  t.is(response.status, 200)
  t.true(response.body && response.body.includes('"hello": "world!"'))
})

test('making an HTTP PUT request', async t => {
  const response = await makeRequest({
    method: 'PUT',
    url: 'http://httpbin.org/put',
    headers: {},
    body: Buffer.from('{"hello": "world!"}')
  })

  t.is(response.status, 200)
  t.true(response.body && response.body.includes('"hello": "world!"'))
})

test('making an HTTP DELETE request', async t => {
  const response = await makeRequest({
    method: 'DELETE',
    url: 'http://httpbin.org/delete',
    headers: {},
    body: Buffer.from('')
  })

  t.is(response.status, 200)
})
