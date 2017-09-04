/* @flow */
import test from 'ava'
import { makeTmpDirectory, remove } from 'file'

export function useTmpDirectory(): void {
  test.beforeEach(async t => {
    const tmpDirectory = await makeTmpDirectory()
    t.context = { ...t.context, tmpDirectory }
  })

  test.afterEach.always(async t => {
    const { tmpDirectory } = t.context
    await remove(tmpDirectory)
  })
}
