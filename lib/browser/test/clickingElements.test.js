/* @flow */
import test from 'test'
import { useBrowser, useTmpDirectory } from 'browser/test/helpers'
import { writeIntoDirectory } from 'file'
import { navigate, clickOn, getUrl } from 'browser'

useBrowser()
useTmpDirectory()

test('attempting to click on an element that does not exist', async t => {
  const { browser, tmpDirectory } = t.context
  await writeIntoDirectory(
    tmpDirectory,
    'index.html',
    `
    <!doctype html>
    <meta charset="utf-8">
  `
  )

  await navigate(browser, `file://${tmpDirectory}/index.html`)
  await t.throws(clickOn(browser, 'Does not exist'))
})

test('clicking on links', async t => {
  const { browser, tmpDirectory } = t.context
  await writeIntoDirectory(
    tmpDirectory,
    'index.html',
    `
    <!doctype html>
    <meta charset="utf-8">
    <a href="#clicked">Click Here</a>
  `
  )

  await navigate(browser, `file://${tmpDirectory}/index.html`)
  await clickOn(browser, 'Click Here')

  const currentUrl = await getUrl(browser)
  t.true(currentUrl.endsWith('#clicked'))
})

test('clicking on buttons', async t => {
  const { browser, tmpDirectory } = t.context
  await writeIntoDirectory(
    tmpDirectory,
    'index.html',
    `
    <!doctype html>
    <meta charset="utf-8">
    <button onclick="history.pushState(null, null, '#clicked')">
      Click Here
    </button>
  `
  )

  await navigate(browser, `file://${tmpDirectory}/index.html`)
  await clickOn(browser, 'Click Here')

  const currentUrl = await getUrl(browser)
  t.true(currentUrl.endsWith('#clicked'))
})

test('clicking on a button input', async t => {
  const { browser, tmpDirectory } = t.context
  await writeIntoDirectory(
    tmpDirectory,
    'index.html',
    `
    <!doctype html>
    <meta charset="utf-8">
    <input
      type="button"
      value="Click Here"
      onclick="history.pushState(null, null, '#clicked')"
    >
  `
  )

  await navigate(browser, `file://${tmpDirectory}/index.html`)
  await clickOn(browser, 'Click Here')

  const currentUrl = await getUrl(browser)
  t.true(currentUrl.endsWith('#clicked'))
})

test('clicking on a submit input', async t => {
  const { browser, tmpDirectory } = t.context
  await writeIntoDirectory(
    tmpDirectory,
    'index.html',
    `
    <!doctype html>
    <meta charset="utf-8">
    <form onsubmit="history.pushState(null, null, '#clicked')">
      <input type="submit" value="Click Here">
    </form>
  `
  )

  await navigate(browser, `file://${tmpDirectory}/index.html`)
  await clickOn(browser, 'Click Here')

  const currentUrl = await getUrl(browser)
  t.true(currentUrl.endsWith('#clicked'))
})
