#!/usr/bin/env node

const readline = require('readline')
const commander = require('commander')
const program = new commander.Command()
const chalk = require('chalk')
const format = require('date-fns/format')

const levels = {
  fatal: {
    number: 1,
    color: chalk.bgRed
  },
  error: {
    number: 2,
    color: chalk.red
  },
  warn: {
    number: 3,
    color: chalk.yellow
  },
  info: {
    number: 4,
    color: chalk.green
  },
  debug: {
    number: 5,
    color: chalk.blue
  },
  trace: {
    number: 6,
    color: chalk.gray
  }
}

program.version('1.0.0')

program
  .addOption(new commander.Option('-l, --level <level>', 'Filter logs by log level.').choices(['fatal', 'error', 'warn', 'info', 'debug', 'trace']))
program.parse(process.argv)

const options = program.opts()
const level = options.level || 'trace'
const levelNr = levels[level].number

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
    // different output from ecs-pino-format Version 0.2.0 vs 0.1.0
    const level = json['log.level'] || json.log.level

    // filter by log level
    const loggedLevelNr = levels[level.toLowerCase()].number
    if (loggedLevelNr && loggedLevelNr > levelNr) return

    const levelFormatted = formatLevel(level)
    const timestamp = formatTimestamp(json['@timestamp'])
    const message = formatMessage(json.message)

    return `${timestamp} - ${levelFormatted}: ${message}`
  } catch (err) {
    console.log(err)
    return line
  }
}

function formatMessage (message) {
  return chalk.cyan(message)
}

function formatTimestamp (timestamp) {
  const date = new Date(timestamp)
  return format(date, 'HH:mm:ss')
}

function formatLevel (level) {
  let formatted = level.toUpperCase()
  formatted += '  '
  formatted = formatted.substring(0, 5)

  const color = levels[level].color
  return color(formatted)
}
