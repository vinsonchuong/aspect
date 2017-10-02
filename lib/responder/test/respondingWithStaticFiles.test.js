/* @flow */
import test from 'test'
import { useTmpDirectory } from 'responder/test/helpers'
import { writeIntoDirectory } from 'file'
import { staticFile } from 'responder'

useTmpDirectory()

test('responding with a static index.html', async t => {
  const { tmpDirectory } = t.context

  await writeIntoDirectory(
    tmpDirectory,
    'index.html',
    `
    <!doctype html>
    <meta charset="utf-8">
    <p>Hello World!</p>
  `
  )

  const respond = staticFile(tmpDirectory)

  const response = await respond({
    method: 'GET',
    url: '/',
    headers: {},
    body: Buffer.from('')
  })

  const now = Date.now()
  const lastModified = Date.parse(response.headers['Last-Modified'])
  t.true(lastModified > now - 2000)
  t.true(lastModified < now + 2000)

  t.is(response.headers['Content-Type'], 'text/html; charset=utf-8')

  t.true(response.body.includes('Hello World!'))
})

test('responding with other static files', async t => {
  const { tmpDirectory } = t.context

  await writeIntoDirectory(
    tmpDirectory,
    'other.html',
    `
    <!doctype html>
    <meta charset="utf-8">
    <p>Other Text</p>
  `
  )

  const respond = staticFile(tmpDirectory)

  const response = await respond({
    method: 'GET',
    url: '/other.html',
    headers: {},
    body: Buffer.from('')
  })

  t.true(response.body.includes('Other Text'))
})

test('responding with 404 when the index.html does not exist', async t => {
  const { tmpDirectory } = t.context

  const respond = staticFile(tmpDirectory)

  const response = await respond({
    method: 'GET',
    url: '/',
    headers: {},
    body: Buffer.from('')
  })

  t.is(response.status, 404)
})

test('responding with 404 when other files do not exist', async t => {
  const { tmpDirectory } = t.context

  const respond = staticFile(tmpDirectory)

  const response = await respond({
    method: 'GET',
    url: '/other.html',
    headers: {},
    body: Buffer.from('')
  })

  t.is(response.status, 404)
})
