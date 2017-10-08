#!/usr/bin/env run
/* @flow */
import { execToTerminal } from 'cli'

async function run() {
  await execToTerminal('standard', ['--verbose', '--fix'])
}
run()
