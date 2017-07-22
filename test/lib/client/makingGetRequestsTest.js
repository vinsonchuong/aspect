/* @flow */
import test from 'ava'
import { request } from 'aspect/src/lib/client'

test('making a GET request', async t => {
  const response = await request({
    method: 'GET',
    url: 'http://example.com/'
  })

  if (response.status !== 'OK') {
    t.fail()
    return
  }

  t.true(response.content.includes('Example Domain'))
  t.is(response.type, 'html')
  t.deepEqual(response.modified, new Date('Fri, 09 Aug 2013 23:54:35 GMT'))
})

test('making a GET request for a resource that has not been modified', async t => {
  const response = await request({
    method: 'GET',
    url: 'http://example.com/',
    modified: new Date('Fri, 09 Aug 2013 23:54:35 GMT')
  })

  t.is(response.status, 'Not Modified')
})

test('making a GET request for a resource that does not exist', async t => {
  const response = await request({
    method: 'GET',
    url: 'http://httpstat.us/404'
  })

  t.is(response.status, 'Not Found')
})
