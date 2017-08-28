/* @flow */
import pkgConf from 'pkg-conf'

const packageOptions = {}
const callOriginal = pkgConf.sync

pkgConf.sync = (packageName, options) => {
  const newOptions =
    packageName in packageOptions
      ? { ...options, defaults: packageOptions[packageName] }
      : options
  return callOriginal(packageName, newOptions)
}

export default function(packageName: string, options: {}) {
  packageOptions[packageName] = options
}
