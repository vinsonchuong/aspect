/* @flow */
import { readFile } from 'fs-extra'

export default function(filePath: string): Promise<Buffer> {
  return readFile(filePath)
}
