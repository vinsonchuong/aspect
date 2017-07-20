/* @flow */
import test from 'ava'
import * as path from 'path'
import {
  readFile,
  makeTmpDirectory,
  writeIntoDirectory,
  remove
} from 'aspect/src/lib/file'

test('making a temporary directory for storing files', async t => {
  const directoryPath = await makeTmpDirectory()
  await writeIntoDirectory(directoryPath, 'foo', 'foo')
  t.is(await readFile(path.join(directoryPath, 'foo'), 'utf8'), 'foo')
  await remove(directoryPath)
})

test('making multiple non-conflicting directories', async t => {
  const directory1 = await makeTmpDirectory()
  const directory2 = await makeTmpDirectory()
  const directory3 = await makeTmpDirectory()

  t.true(directory1 !== directory2)
  t.true(directory1 !== directory3)
  t.true(directory2 !== directory3)

  await remove(directory1)
  await remove(directory2)
  await remove(directory3)
})
