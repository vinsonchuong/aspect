/* @flow */
import test from 'test'
import { useTmpDirectory } from 'responder/test/helpers'
import { writeIntoDirectory } from 'file'
import { javaScriptModule } from 'responder'

useTmpDirectory()

test('responding with 404 if the file does not exist', async t => {
  const { tmpDirectory } = t.context

  const respond = javaScriptModule(tmpDirectory)

  const response = await respond({
    method: 'GET',
    url: '/index.js',
    headers: {},
    body: Buffer.from('')
  })

  t.is(response.status, 404)
})

test('responding with compiled JavaScript', async t => {
  const { tmpDirectory } = t.context

  await writeIntoDirectory(
    tmpDirectory,
    'index.js',
    `
    /* @flow */
    import React from 'react'
    import message from './helloWorld'

    export default function(text: string) {
      console.log(message)
      console.log(text)
      console.log(React.createElement('div'))
    }
    `
  )

  const respond = javaScriptModule(tmpDirectory)

  const response = await respond({
    method: 'GET',
    url: '/index.js',
    headers: {},
    body: Buffer.from('')
  })

  t.is(
    response.headers['Content-Type'],
    'application/javascript; charset=utf-8'
  )
  t.is(
    response.headers['Last-Modified'].slice(0, -13),
    new Date().toUTCString().slice(0, -13)
  )

  t.true(response.body.includes("from './helloWorld'"))
  t.true(response.body.includes("from '/npm/react'"))
  t.true(response.body.includes('export default'))
  t.false(response.body.includes('text: string'))
})

test('responding with compiled npm modules', async t => {
  const { tmpDirectory } = t.context
  const respond = javaScriptModule(tmpDirectory)

  const response = await respond({
    method: 'GET',
    url: '/npm/react',
    headers: {},
    body: Buffer.from('')
  })

  t.is(
    response.headers['Content-Type'],
    'application/javascript; charset=utf-8'
  )
  t.true('Last-Modified' in response.headers)

  t.true(response.body.includes('export default'))
  t.false(response.body.includes('import'))
})
