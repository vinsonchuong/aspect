/* @flow */
function setGlobal(text: string): void {
  global.someVariable = text
}
setGlobal('Hello World!')
