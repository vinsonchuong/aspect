/* @flow */
import type { ChildProcess } from 'child_process'
import { spawn } from 'child_process'

export type Process = {
  childProcess: ChildProcess,
  pid: number,
  stdout: string
}

export default function(command: string, args: Array<string>): Process {
  const childProcess = spawn(command, args, {
    detached: true
  })
  const wrapper = {
    childProcess,
    pid: childProcess.pid,
    stdout: ''
  }

  childProcess.stdout.setEncoding('utf8')
  childProcess.stdout.on('data', data => {
    wrapper.stdout += data
  })

  return wrapper
}
