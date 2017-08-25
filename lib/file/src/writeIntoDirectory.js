/* @flow */
import * as path from 'path'
import * as fse from 'fs-extra'
import dedent from 'dedent'

export default async function(
  directoryPath: string,
  name: string,
  contents: string
): Promise<string> {
  const filePath = path.join(directoryPath, name)
  await fse.writeFile(filePath, dedent`${contents}`)
  return filePath
}
