const fs = require('fs')

module.exports = function getContractAddresses() {
  return JSON.parse(fs.readFileSync(`${process.cwd()}/contractAddresses.json`).toString())
}

module.exports = function writeContractAddresses(contractAddresses) {
  fs.writeFileSync(
    `${process.cwd()}/contractAddresses.json`,
    JSON.stringify(contractAddresses, null, 2) // Indent 2 spaces
  )
}
