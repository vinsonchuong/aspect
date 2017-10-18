// @flow

const emptyBody = Buffer.from('')

export const notFound = {
  status: 404,
  headers: {},
  body: emptyBody
}
