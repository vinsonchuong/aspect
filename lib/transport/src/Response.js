/* @flow */
import type { Headers } from 'transport'

export type Response = {
  status: number,
  headers: Headers,
  body: Buffer
}
