/* @flow */
import type { WebDriver } from 'selenium-adapter'
import { findElement, getText } from 'selenium-adapter'

export default async function(
  adapter: WebDriver,
  selector: string
): Promise<?string> {
  const element = await findElement(adapter, selector)
  return getText(element)
}
