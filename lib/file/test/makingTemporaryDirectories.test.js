/* @flow */
import test from 'test'
import { readFile, makeTmpDirectory, writeIntoDirectory, remove } from 'file'

test('making a temporary directory for storing files', async t => {
  const directoryPath = await makeTmpDirectory()
  const filePath = await writeIntoDirectory(directoryPath, 'foo', 'foo')

  const fileBuffer = await readFile(filePath)
  t.is(fileBuffer.toString(), 'foo')

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
