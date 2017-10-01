/* @flow */

export default function(modulePath: string): void {
  require('compiler/node-hook')

  /* $FlowFixMe */
  require(modulePath)
}
