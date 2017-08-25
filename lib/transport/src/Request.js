/* @flow */
import type { Headers } from 'transport'

export type Request = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  headers: Headers,
  body: Buffer
}
