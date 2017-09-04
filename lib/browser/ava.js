/* @flow */
import test from 'ava'
import { startBrowser, closeBrowser } from 'browser'

export function useBrowser(): void {
  test.beforeEach(t => {
    const browser = startBrowser()
    t.context = { ...t.context, browser }
  })

  test.afterEach.always(async t => {
    const { browser } = t.context
    await closeBrowser(browser)
  })
}
