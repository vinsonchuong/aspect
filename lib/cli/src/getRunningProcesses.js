/* @flow */
import { exec } from 'cli'

type ProcessRow = {
  pid: number,
  command: string
}

export default async function(): Promise<Array<ProcessRow>> {
  const output = await exec('ps', ['-Ao', 'pid,args'])
  return output
    .split('\n')
    .slice(1)
    .map(line => {
      const match = line.match(/\s*(\d+)\s+(.*)/)
      if (!match) {
        return null
      }
      return {
        pid: Number(match[1]),
        command: match[2]
      }
    })
    .filter(Boolean)
}
