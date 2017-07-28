/* @flow */
import test from 'ava'
import { URL } from 'url'
import { compile } from 'aspect/src/lib/compiler'

test('compiling ESnext and unstandardized features to ES2017', async t => {
  const request = {
    method: 'GET',
    url: new URL('http://127.0.0.1:8080/lib/compiler/compile.js')
  }

  const response = await compile(request)

  if (response.error) {
    return t.fail()
  }

  t.is(response.type, 'js')
  t.true(response.content.includes('export default'))
  t.false(response.content.includes('request: Request'))
})

test('compiling npm packages to ES modules', async t => {
  const request = {
    method: 'GET',
    url: new URL('http://127.0.0.1:8080/npm/react')
  }
  const response = await compile(request)

  if (response.error) {
    return t.fail()
  }

  t.is(response.type, 'js')
  t.true(response.content.includes('export default react'))
})
