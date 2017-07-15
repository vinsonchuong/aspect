/* @flow */
import type { WebDriver } from 'selenium-adapter'
import { evaluate } from 'selenium-adapter'

export default function(adapter: WebDriver): Promise<string> {
  return evaluate(adapter, () => document.location.href)
}
