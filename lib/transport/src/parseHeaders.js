/* @flow */
import { Headers as FetchHeaders } from 'node-fetch'
import normalizeHeaderCase from 'header-case-normalizer'
import type { Headers } from 'transport'

export default function(headers: FetchHeaders | Headers): Headers {
  const parsedHeaders = {}

  const entries =
    headers instanceof FetchHeaders
      ? headers.entries()
      : Object.entries(headers)

  for (const [name, value] of entries) {
    parsedHeaders[normalizeHeaderCase(name)] = value
  }
  return parsedHeaders
}
