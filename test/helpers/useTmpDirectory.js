/* @flow */
import test from 'ava'
import { makeTmpDirectory, remove } from 'aspect/src/lib/file'

export default function(): void {
  test.beforeEach(async t => {
    const tmpDirectory = await makeTmpDirectory()
    Object.assign(t.context, { tmpDirectory })
  })

  test.afterEach.always(async t => {
    const { tmpDirectory } = t.context
    await remove(tmpDirectory)
  })
}
