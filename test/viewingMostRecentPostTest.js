/* @flow */
import test from 'ava'
import serve from 'aspect/src/serve'
import { close as closeServer } from 'aspect/src/server'
import {
  makeHeadlessChromeAdapter,
  close as closeBrowser,
  navigate,
  findElement,
  getText
} from 'selenium-adapter'

test.beforeEach(async t => {
  const server = await serve()
  const browser = makeHeadlessChromeAdapter()
  t.context = { server, browser }
})

test.afterEach.always(async t => {
  const { server, browser } = t.context
  await closeBrowser(browser)
  await closeServer(server)
})

test('viewing the app over HTTP', async t => {
  const { server, browser } = t.context
  await navigate(browser, `http://127.0.0.1:${server.port}`)
  const paragraph = await findElement(browser, 'p')
  t.is(await getText(paragraph), 'Hello World!')
})
