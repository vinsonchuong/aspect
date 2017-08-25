/* @flow */
import type { WebDriver } from 'selenium-adapter'
import { fillIn } from 'selenium-adapter'
import { findField } from 'browser'

export default async function(
  adapter: WebDriver,
  labelText: string,
  value: string
): Promise<void> {
  const input = await findField(adapter, labelText)
  await fillIn(input, value)
}
