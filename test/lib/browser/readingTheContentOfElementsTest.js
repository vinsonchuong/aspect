/* @flow */
import test from 'ava'
import { useBrowser, useTmpDirectory } from 'aspect/test/helpers'
import { writeIntoDirectory } from 'aspect/src/lib/file'
import { navigate, read } from 'aspect/src/lib/browser'

useBrowser()
useTmpDirectory()

test('reading the contents of an element', async t => {
  const { browser, tmpDirectory } = t.context
  await writeIntoDirectory(
    tmpDirectory,
    'index.html',
    `
    <!doctype html>
    <meta charset="utf-8">
    <div>Text</div>
  `
  )

  await navigate(browser, `file://${tmpDirectory}/index.html`)
  t.is(await read(browser, 'div'), 'Text')
})
