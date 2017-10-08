#!/usr/bin/env run
/* @flow */
import { execToTerminal } from 'cli'

async function run() {
  await execToTerminal('sh', ['-c', 'pwd'], { cwd: __dirname })
}
run()
