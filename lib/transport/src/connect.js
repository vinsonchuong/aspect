/* @flow */
import type { Session } from 'transport'
import { connect } from 'http2'

export default function(host: string): Session {
  return connect(`https://${host}`)
}
