/* @flow */

export default function(modulePath: string): void {
  require('babel-register')

  /* $FlowFixMe */
  require(modulePath)
}
