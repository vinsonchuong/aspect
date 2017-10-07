/* @flow */
import type { Process } from 'cli'
import { nextEvent } from 'conversion'

export default function({ childProcess }: Process): Promise<void> {
  process.kill(-childProcess.pid)
  return nextEvent('close', childProcess)
}
