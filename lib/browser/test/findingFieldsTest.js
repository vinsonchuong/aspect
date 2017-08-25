/* @flow */
import test from 'ava'
import { useBrowser, useTmpDirectory } from 'browser/test/helpers'
import { writeIntoDirectory } from 'file'
import { navigate, findField, getAttribute } from 'browser'

useBrowser()
useTmpDirectory()

test('finding a field contained within a label by label text', async t => {
  const { browser, tmpDirectory } = t.context
  await writeIntoDirectory(
    tmpDirectory,
    'index.html',
    `
    <!doctype html>
    <meta charset="utf-8">
    <label>
      Label Text
      <input id="input">
    </label>`
  )
  await navigate(browser, `file://${tmpDirectory}/index.html`)

  const input = await findField(browser, 'Label Text')
  t.is(await getAttribute(input, 'id'), 'input')
})

test('finding a field contained associated with a label by label text', async t => {
  const { browser, tmpDirectory } = t.context
  await writeIntoDirectory(
    tmpDirectory,
    'index.html',
    `
    <!doctype html>
    <meta charset="utf-8">
    <label for="input">Label Text</label>
    <input id="input">`
  )
  await navigate(browser, `file://${tmpDirectory}/index.html`)

  const input = await findField(browser, 'Label Text')
  t.is(await getAttribute(input, 'id'), 'input')
})

test('throwing an exception when a field cannot be found', async t => {
  const { browser, tmpDirectory } = t.context
  await writeIntoDirectory(
    tmpDirectory,
    'index.html',
    `
    <!doctype html>
    <meta charset="utf-8">`
  )
  await navigate(browser, `file://${tmpDirectory}/index.html`)

  await t.throws(findField(browser, 'Label Text'))
})
