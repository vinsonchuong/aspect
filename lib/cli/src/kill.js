/* @flow */
import type { Process } from 'cli'

export default function({ childProcess }: Process): Promise<void> {
  return new Promise(resolve => {
    childProcess.on('close', resolve)
    process.kill(-childProcess.pid)
  })
}
