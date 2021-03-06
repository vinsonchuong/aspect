/* @flow */
import test from 'test'
import { useBrowser, useTmpDirectory } from 'browser/test/helpers'
import { writeIntoDirectory } from 'file'
import { navigate, readField } from 'browser'

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
