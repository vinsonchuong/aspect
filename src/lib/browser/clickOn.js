/* @flow */
import type { WebDriver } from 'selenium-adapter'
import { click } from 'selenium-adapter'
import searchForElement from './searchForElement'

export default async function(
  adapter: WebDriver,
  elementText: string
): Promise<void> {
  const element = await searchForElement(
    adapter,
    ['a, button', elementText],
    [`input[type="submit"][value="${elementText}"]`],
    [`input[type="button"][value="${elementText}"]`]
  )

  if (!element) {
    throw new Error('Could not find link or button containing given text')
  }
  await click(element)
}
