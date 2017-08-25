/* @flow */
import test from 'ava'
import { useBrowser, useTmpDirectory } from 'browser/test/helpers'
import { writeIntoDirectory } from 'file'
import { navigate, fillIn, readField } from 'browser'

useBrowser()
useTmpDirectory()

test('filling in a text input by label', async t => {
  const { browser, tmpDirectory } = t.context
  await writeIntoDirectory(
    tmpDirectory,
    'index.html',
    `
    <!doctype html>
    <meta charset="utf-8">
    <label>
      Text Input
      <input type="text">
    </label>
  `
  )

  await navigate(browser, `file://${tmpDirectory}/index.html`)
  await fillIn(browser, 'Text Input', 'value')
  t.is(await readField(browser, 'Text Input'), 'value')
})
