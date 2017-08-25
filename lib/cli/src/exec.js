/* @flow */
import { execFile } from 'child_process'

export default async function(
  command: string,
  args: Array<string>
): Promise<string> {
  const stdout = await new Promise((resolve, reject) => {
    execFile(command, args, (error, stdout, stderr) => {
      if (error) reject(error)
      else resolve(stdout)
    })
  })
  return stdout.trim()
}
