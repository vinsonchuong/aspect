/* @flow */
import { childProcess } from 'node-promise-es6'

export default async function(
  command: string,
  args: Array<string>
): Promise<string> {
  const { stdout } = await childProcess.execFile(command, args)
  return stdout.trim()
}
