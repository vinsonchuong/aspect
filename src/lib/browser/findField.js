/* @flow */
import type { WebDriver, WebDriverElement } from 'selenium-adapter'
import { findElement, getAttribute } from 'selenium-adapter'

export default async function(
  adapter: WebDriver,
  labelText: string
): Promise<WebDriverElement> {
  const label = await findElement(adapter, 'label', labelText)
  const associatedId = await getAttribute(label, 'for')

  const input = associatedId
    ? await findElement(adapter, `#${associatedId}`)
    : await findElement(label, 'input')

  if (!input) {
    throw new Error('Could not find input with given label text')
  }

  return input
}
