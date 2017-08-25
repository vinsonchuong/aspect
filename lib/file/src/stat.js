/* @flow */
import { Stats } from 'fs'
import { stat } from 'fs-extra'

export default async function(filePath: string): Promise<?Stats> {
  try {
    return await stat(filePath)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null
    } else {
      throw error
    }
  }
}
