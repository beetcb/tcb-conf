const fs = require('fs')
const confPath = `/tmp/conf/conf.json`

let hotConf

class Conf {
  constructor() {
    if (!fs.existsSync('/tmp')) {
      fs.mkdirSync('/tmp')
    } else {
      if (!fs.existsSync('/tmp/conf')) {
        fs.mkdirSync('/tmp/conf')
      }
    }

    if (!fs.existsSync(confPath)) {
      fs.writeFileSync(confPath, '{}')
    }

    hotConf = JSON.parse(fs.readFileSync(confPath))
  }

  get(key) {
    return hotConf[key]
  }

  set(key, value) {
    if (key && value !== undefined) {
      hotConf[key] = value
    }
    return value
  }

  del(key) {
    delete hotConf[key]
    this.set()
  }

  clear() {
    hotConf = {}
    this.set()
  }

  // Buffer to avoid multiple request
  close() {
    // Store conf to file, this shall not block function runtime
    fs.promises.writeFile(confPath, stringify(hotConf))
  }
}

function stringify(data) {
  if (!data) return
  if (typeof data === 'string') return data
  return JSON.stringify(data)
}

module.exports = new Conf()
