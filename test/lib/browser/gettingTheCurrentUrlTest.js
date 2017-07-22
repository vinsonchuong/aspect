/* @flow */
import test from 'ava'
import { useBrowser } from 'aspect/test/helpers'
import { navigate, getUrl } from 'aspect/src/lib/browser'

useBrowser()

test('getting the current url', async t => {
  const { browser } = t.context

  await navigate(browser, 'http://example.com/')
  t.is(await getUrl(browser), 'http://example.com/')

  await navigate(browser, 'https://www.mozilla.org/en-US/')
  t.is(await getUrl(browser), 'https://www.mozilla.org/en-US/')
})