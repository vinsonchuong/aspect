/* @flow */
import type { WebDriver, WebDriverElement } from 'selenium-adapter'
import { findElement } from 'selenium-adapter'

export default async function(
  adapter: WebDriver,
  ...queries: Array<[string] | [string, string]>
): Promise<?WebDriverElement> {
  for (const query of queries) {
    const element = await findElement(adapter, ...query)
    if (element) {
      return element
    }
  }
  return null
}
