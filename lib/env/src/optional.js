/* @flow */
export default function<T>(parse: string => T): (?string) => ?T {
  return value => (typeof value === 'string' ? parse(value) : null)
}
