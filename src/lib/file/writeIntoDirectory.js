/* @flow */
import * as path from 'path'
import * as fse from 'fs-extra'
import dedent from 'dedent'

export default async function(
  directoryPath: string,
  name: string,
  contents: string
): Promise<void> {
  await fse.writeFile(path.join(directoryPath, name), dedent`${contents}`)
}
