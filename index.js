'use strict'

const { clean, parse, validate } = require('./command-parser')

module.exports = (string, specs, env = {}) => {
  const cleaned = clean(string, env)
  const parsed = parse(cleaned)

  return validate(parsed, specs, env)
}
