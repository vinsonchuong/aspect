/* @flow */
import * as url from 'url'

export default function(
  urlString: string
): { protocol: string, host: string, path: string } {
  const { protocol, host, path } = url.parse(urlString)
  if (!protocol || !host || !path) {
    throw new Error('Please provide a full URL')
  }
  return { protocol, host, path }
}
