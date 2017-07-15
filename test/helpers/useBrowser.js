/* @flow */
import test from 'ava'
import { startBrowser, closeBrowser } from 'aspect/src/lib/browser'

export default function(): void {
  test.beforeEach(t => {
    const browser = startBrowser()
    Object.assign(t.context, { browser })
  })

  test.afterEach.always(async t => {
    const { browser } = t.context
    await closeBrowser(browser)
  })
}
