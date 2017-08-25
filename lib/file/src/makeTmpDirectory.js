/* @flow */
import { ensureDir } from 'fs-extra'
import { file as tmpPath } from 'tempy'

export default async function(): Promise<string> {
  const directoryPath = tmpPath()
  await ensureDir(directoryPath)
  return directoryPath
}
