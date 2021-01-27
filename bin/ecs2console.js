#!/usr/bin/env node

const readline = require('readline')
const commander = require('commander')
const program = new commander.Command()

const levels = {
  fatal: 1,
  error: 2,
  warn: 3,
  info: 4,
  debug: 5,
  trace: 6
}

program.version('1.0.0')

program
  .addOption(new commander.Option('-l, --level <level>', 'Filter logs by log level.').choices(['fatal', 'error', 'warn', 'info', 'debug', 'trace']))
program.parse(process.argv)

const options = program.opts()
const level = options.level || 'trace'
const levelNr = levels[level]

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

rl.on('line', function (line) {
  const out = convert(line, levelNr)
  if (out) {
    console.log(out)
  }
})

function convert (line, levelNr) {
  try {
    const json = JSON.parse(line)
    const level = json.log.level

    // filter by log level
    const loggedLevelNr = levels[level.toLowerCase()]
    if (loggedLevelNr && loggedLevelNr > levelNr) return

    const levelFormatted = formatLevel(level)
    const timestamp = formatTimestamp(json['@timestamp'])
    const message = json.message

    return `${timestamp} - ${levelFormatted}: ${message}`
  } catch (err) {
    return line
  }
}

function formatTimestamp (timestamp) {
  const date = timestamp.substring(0, 10)
  const time = timestamp.substring(11, 19)
  return `${date} ${time}`
}

function formatLevel (level) {
  let formatted = level.toUpperCase()
  formatted += '  '
  formatted = formatted.substring(0, 5)
  return formatted
}
