/* @flow */
import type { Headers } from 'transport'
import fresh from 'fresh'
import { mapKeys } from 'lodash'

export default function(
  requestHeaders: Headers,
  responseHeaders: Headers
): boolean {
  return fresh(lowerCaseKeys(requestHeaders), lowerCaseKeys(responseHeaders))
}

function lowerCaseKeys(object) {
  return mapKeys(object, (value, key) => key.toLowerCase())
}
