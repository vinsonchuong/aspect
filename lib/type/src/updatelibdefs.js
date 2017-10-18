#!/usr/bin/env run
/* @flow */
import * as path from 'path'
import { promisify } from 'util'
import { execToTerminal } from 'cli'
import glob from 'glob'

async function run() {
  const typePackageJsonPath = require.resolve('type/package.json')

  await execToTerminal('flow-typed', [
    'update',
    '--skip',
    '--packageDir',
    typePackageJsonPath
  ])

  const rootPackageJson = require(path.resolve('package.json'))
  for (const entry of rootPackageJson.workspaces) {
    for (const directory of await promisify(glob)(entry)) {
      await execToTerminal(
        'flow-typed',
        ['update', '--skip', '--packageDir', typePackageJsonPath],
        { cwd: path.resolve(directory) }
      )
    }
  }
}
run()
