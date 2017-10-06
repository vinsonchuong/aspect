/* @flow */
import * as path from 'path'
import contentType from 'content-type'
import mime from 'mime'

export default function(url: string) {
  return contentType.format({
    type: mime.getType(path.extname(url)),
    parameters: {
      charset: 'utf-8'
    }
  })
}
