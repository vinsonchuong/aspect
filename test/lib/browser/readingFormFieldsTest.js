/* @flow */
import test from 'ava'
import { useBrowser, useTmpDirectory } from 'aspect/test/helpers'
import { writeIntoDirectory } from 'aspect/src/lib/file'
import { navigate, readField } from 'aspect/src/lib/browser'

useBrowser()
useTmpDirectory()

test('reading the value from a text input by label', async t => {
  const { browser, tmpDirectory } = t.context
  await writeIntoDirectory(
    tmpDirectory,
    'index.html',
    `
    <!doctype html>
    <meta charset="utf-8">
    <label>
      Label Text
      <input value="value">
    </label>`
  )
  await navigate(browser, `file://${tmpDirectory}/index.html`)

  t.is(await readField(browser, 'Label Text'), 'value')
})
