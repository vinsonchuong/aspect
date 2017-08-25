/* @flow */
import { promisify } from 'util'
import { gunzip } from 'zlib'

export default promisify(gunzip)
