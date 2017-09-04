/* @flow */

export default function<R, S: { [string]: (?string) => R }>(
  schema: S
): $ObjMap<S, <T>((string) => T) => T> {
  return Object.keys(schema).reduce((result, key) => {
    try {
      return {
        ...result,
        [key]: schema[key](process.env[key])
      }
    } catch (error) {
      if (error.message === 'Required') {
        throw new Error(`${key} is not defined in the environment`)
      } else {
        throw error
      }
    }
  }, {})
}
