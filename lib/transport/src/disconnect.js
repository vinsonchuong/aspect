/* @flow */
import type { Session } from 'transport'

export default async function(session: Session): Promise<void> {
  return new Promise(resolve => {
    session.shutdown({ graceful: true }, () => {
      session.destroy()
      resolve()
    })
  })
}
