'use strict'

const { split } = require('shellwords')

module.exports = (command, env) => {
  const cleaned = `{${command}}`
    // in string substitutions
    // TODO: fail on endefined env
    .replace(/\${([a-z_A-Z0-9]+)}/g, (match, name) => env[name])
    // give ? some space
    .replace(/\?/g, '? ')
    .replace(/{/g, ' { ')
    .replace(/}/g, ' } ')
    .replace(/[ \t]*:/g, ' : ')

  return split(cleaned)
}
