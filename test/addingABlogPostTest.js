/* @flow */
import test from 'ava'
import { useBrowser, useServer } from 'aspect/test/helpers'
import { navigate, clickOn, fillIn, read } from 'aspect/src/lib/browser'

useBrowser()
useServer()

test.skip('viewing the app over HTTP', async t => {
  const { server, browser } = t.context
  await navigate(browser, `http://127.0.0.1:${server.port}`)

  await clickOn(browser, 'New Post')
  await fillIn(browser, 'Title', 'New Blog Post')
  await fillIn(browser, 'Content', 'New blog post content.')
  await clickOn(browser, 'Post')

  t.is(await read(browser, 'article p'), 'New blog post content.')
})
