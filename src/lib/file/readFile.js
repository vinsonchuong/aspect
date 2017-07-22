/* @flow */
import { readFile } from 'fs-extra'

export default function(filePath: string): Promise<string> {
  return readFile(filePath, 'utf8')
}
