/* @flow */
import { exec } from 'cli'

export default async function(): Promise<Array<string>> {
  const output = await exec('ss', ['-ltn'])
  return output
    .split('\n')
    .slice(1)
    .map(line => {
      const match = line.match(/LISTEN\s+\d+\s+\d+\s+(\S+)/)
      if (!match) {
        return null
      }
      return match[1]
    })
    .filter(Boolean)
}
