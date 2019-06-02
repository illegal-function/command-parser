'use strict'

const identifier = /^[a-zA-Z_][a-zA-Z0-9\-_]+$/

module.exports = command => {
  const result = { params: {} }

  if (command[0] !== '{') {
    throw new Error('Syntax Error: expected \'{\' but found ' + command[0])
  }

  command.shift()

  // expect library prefix
  if (command[0] !== '?') {
    throw new Error('Syntax Error: expected \'?\' but found ' + command[0])
  }

  command.shift()

  // expect identifier
  if (!command[0].match(identifier)) {
    throw new Error('Syntax Error: expected identifier but found ' + command[0])
  }

  result.library = command.shift()

  // command name (identifier)
  if (!command[0].match(identifier)) {
    throw new Error('Syntax Error: expected identifier but found ' + command[0])
  }

  result.command = command.shift()

  while (command[0].match(identifier)) {
    const pname = command.shift()

    if (command[0] === ':') {
      command.shift()
    }
    else {
      result.params[pname] = true
      continue
    }

    if (command[0] === '{') {
      // don't shift
      result.params[pname] = module.exports(command)
    }
    else {
      result.params[pname] = command.shift()
    }
  }

  if (command[0] !== '}') {
    throw new Error('Syntax Error: expected \'}\' but found ' + command[0])
  }

  command.shift()

  return result
}
