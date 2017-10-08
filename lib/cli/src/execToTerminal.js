/* @flow */
import { spawn } from 'child_process'
import { nextEvent } from 'conversion'

export default async function(
  command: string,
  args: Array<string>,
  options: ?{ cwd?: string }
): Promise<number> {
  const childProcess = spawn(command, args, { ...options, stdio: 'inherit' })
  return nextEvent('close', childProcess)
}
