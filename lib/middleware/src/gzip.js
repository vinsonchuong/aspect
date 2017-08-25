/* @flow */
import { promisify } from 'util'
import { gzip } from 'zlib'

export default promisify(gzip)
