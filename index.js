'use strict'

const { clean, parse, validate } = require('./command-parser')

module.exports = (string, specs, env = {}) => {
  const cleaned = clean(string, env)
  const parsed = parse(cleaned)

  return validate(parsed, specs, env)
}

const spec = [
  { name: 'lib', commands: [
    { name: 'command', params: [
      { name: 'arg', type: 'string' },
      { name: 'a2', type: 'string' },
    ] },
  ] },
  { name: 'test', commands: [
    { name: 'command2', params: [
      { name: 'v123', type: 'string' },
    ] },
  ] },
]

console.log(
  module.exports(
    '?lib command arg:$test a2: { ?test command2 v123:"dette er ${test} test" }',
    spec,
    { test: 'ENV_VARIABLE' },
  )
)
