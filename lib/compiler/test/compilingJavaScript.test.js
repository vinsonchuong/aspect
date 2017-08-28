/* @flow */
import test from 'test'
import { useTmpDirectory } from 'compiler/test/helpers'
import { writeIntoDirectory } from 'file'
import { compileJs } from 'compiler'

useTmpDirectory()

test('compiling ES.next and unstandardized features', async t => {
  const { tmpDirectory } = t.context
  const filePath = await writeIntoDirectory(
    tmpDirectory,
    'index.js',
    `
      /* @flow */
      export default function(x: number, y: number): number {
        return x + y
      }
    `
  )

  const compiledCode = await compileJs(filePath)
  t.true(compiledCode.includes('export default'))
  t.false(compiledCode.includes(': number'))
})

test('compiling only one file at a time', async t => {
  const { tmpDirectory } = t.context
  const filePath = await writeIntoDirectory(
    tmpDirectory,
    'index.js',
    `
      import hello from './hello'
      console.log(hello)
    `
  )
  await writeIntoDirectory(
    tmpDirectory,
    'hello.js',
    `
      export default 'Hello World!'
    `
  )

  const compiledCode = await compileJs(filePath)
  t.false(compiledCode.includes('Hello World!'))
})
