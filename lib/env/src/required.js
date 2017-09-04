/* @flow */
export default function<T>(parse: string => T): (?string) => T {
  return value => {
    if (typeof value !== 'string') {
      throw new Error('Required')
    }

    return parse(value)
  }
}
