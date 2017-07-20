/* @flow */
import test from 'ava'
import { URL } from 'url'
import respondToHttpRequest from 'aspect/src/respondToHttpRequest'

test('responds to a request for root with index.html', async t => {
  const response = await respondToHttpRequest({
    method: 'GET',
    url: new URL('http://example.com/')
  })
  t.true(response.content.includes('<!doctype html>'))
  t.is(response.type, 'html')
  t.true(response.modified instanceof Date)
})

test('responds to a request for any file inside of src', async t => {
  const response = await respondToHttpRequest({
    method: 'GET',
    url: new URL('http://example.com/respondToHttpRequest.js')
  })
  t.true(response.content.includes('/* @flow */'))
  t.is(response.type, 'js')
  t.true(response.modified instanceof Date)
})
