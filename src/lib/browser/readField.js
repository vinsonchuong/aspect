/* @flow */
import type { WebDriver } from 'selenium-adapter'
import { getAttribute } from 'selenium-adapter'
import { findField } from './'

export default async function(
  adapter: WebDriver,
  labelText: string
): Promise<?string> {
  const input = await findField(adapter, labelText)
  return getAttribute(input, 'value')
}
