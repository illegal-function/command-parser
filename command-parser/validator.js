'use strict'

const isObject = v => typeof v === 'object' && v !== null

const findLibrary = (command, spec) => {
  const rv = spec.find(e => e.name === command.library)
  if (!rv) throw new Error(`Library '${command.library}' not found`)
  return rv
}

const findCommand = (command, lib) => {
  const rv = lib.commands.find(e => e.name === command.command)
  if (!rv) throw new Error(`Command '${command.command}' in '${lib.library}' not found`)
  return rv
}

module.exports = (command, spec, env) => {
  Object.keys(command.params).forEach(key => {
    // handle sub commands
    if (isObject(command.params[key])) {
      command.params[key] = module.exports(command.params[key], spec, env)
    }
    // expand environment variables
    else if (command.params[key][0] === '$') {
      if (env[command.params[key].substring(1)] === undefined) {
        throw new Error(`Environment variable '${command.params[key].substring(1)}' is undefined`)
      }
      command.params[key] = env[command.params[key].substring(1)]
    }
  })

  const libSpec = findLibrary(command, spec)
  const commandSpec = findCommand(command, libSpec)

  // apply defaults
  commandSpec.params.forEach(spec => {
    if (command.params[spec.name] === undefined) {
      if (spec.default !== undefined) {
        command.params[spec.name] = spec.default
      }
      // check if optional since it's undefined
      else if (!spec.optional) {
        throw new Error(`Parameter ${spec.name} is required for '${commandSpec.name}'`)
      }
    }
  })

  // look for extra arguments
  Object.keys(command.params).forEach(key => {
    if (!commandSpec.params.find(e => e.name === key)) {
      throw new Error(`Parameter '${key}' unknown`)
    }
  })

  // type checking

  return command
}
