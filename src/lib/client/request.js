/* @flow */
import fetch from 'node-fetch'

export default async function(url: string): Promise<string> {
  const response = await fetch(url)
  return response.text()
}
