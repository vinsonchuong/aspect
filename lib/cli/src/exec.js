/* @flow */
import { execFile } from 'child_process'
import { promisify } from 'util'

export default async function(
  command: string,
  args: Array<string>
): Promise<string> {
  const { stdout } = await promisify(execFile)(command, args)
  return stdout.trim()
}
