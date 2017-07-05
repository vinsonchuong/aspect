/* @flow */
import type { Process } from './'

export default function(
  { childProcess }: Process,
  output: string
): Promise<void> {
  return new Promise(resolve => {
    childProcess.stdout.on('data', data => {
      if (data.includes(output)) {
        resolve()
      }
    })
  })
}
