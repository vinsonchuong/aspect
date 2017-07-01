/* @flow */
import test from 'ava'
import { listen, subscribe, close as closeServer } from 'aspect/src/server'
import respondToHttpRequest from 'aspect/src/respondToHttpRequest'
import {
  makeHeadlessChromeAdapter,
  close as closeBrowser,
  navigate,
  findElement,
  getText
} from 'selenium-adapter'

test.beforeEach(async t => {
  const server = await listen(8080)
  subscribe(server, respondToHttpRequest)
  const browser = makeHeadlessChromeAdapter()
  t.context = { server, browser }
})

test.afterEach.always(async t => {
  const { server, browser } = t.context
  await closeBrowser(browser)
  await closeServer(server)
})

test.serial('viewing the app over HTTP', async t => {
  const { browser } = t.context
  await navigate(browser, 'http://127.0.0.1:8080')
  const paragraph = await findElement(browser, 'p')
  t.is(await getText(paragraph), 'Hello World!')
})
