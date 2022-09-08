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
  let json = null
  try {
    json = JSON.parse(line)
  } catch (e) {
    // not a json
    return line
  }

  try {
    // different output from ecs-pino-format Version 0.2.0 vs 0.1.0
    const level = json['log.level'] || json.log.level
    const cleanLevel = level === 'WARNING' ? 'warn' : level.toLowerCase()

    // filter by log level
    const loggedLevelNr = levels[cleanLevel.toLowerCase()].number
    if (loggedLevelNr && loggedLevelNr > levelNr) return

    const levelFormatted = formatLevel(cleanLevel)
    const timestamp = formatTimestamp(json['@timestamp'])
    const message = formatMessage(json)
    const errStack = formatException(json)

    return `${timestamp} - ${levelFormatted}: ${message}${errStack}`
  } catch (err) {
    console.error(`ERROR: Unexpected bug in ecs2sonosle - ${err}`)
    return line
  }
}

function formatMessage (json) {
  let message = json.message
  if (json.scraper) {
    const scraperDetails = []
    Object.entries(json.scraper).map(([key, val]) => key !== 'exception' && scraperDetails.push(`${key}=${JSON.stringify(val)}`))
    if (scraperDetails.length) message += ` (${scraperDetails.join(', ')})`
  }

  return chalk.cyan(`${message}`)
}

function formatTimestamp (timestamp) {
  const date = new Date(timestamp)
  return format(date, 'HH:mm:ss')
}

function formatLevel (level) {
  let formatted = level.toUpperCase()
  formatted += '  '
  formatted = formatted.substring(0, 5)

  if (levels[level]) {
    const color = levels[level].color
    return color(formatted)
  } else {
    return formatted
  }
}

function formatException (json) {
  let exception = null
  try {
    exception = json.stack || json.scraper.exception
  } catch (e) {}

  if (exception) {
    let errStack = ''

    // Parse error.type and error.details from ApifyClientError.
    const errDetails = []
    if (exception.type) errDetails.push(`type=${exception.type}`)
    if (exception.details) {
      Object.entries(exception.details).map(([key, val]) => errDetails.push(`${key}=${val}`))
    }

    // Parse error stack lines.
    // NOTE: Reason is here to support Meteor.js like errors.
    const errorString = exception.stack || exception.reason || exception.toString()
    const errorLines = errorString.split('\n')

    // Add details to a first line.
    if (errDetails.length) errorLines[0] += `(details: ${errDetails.join(', ')})`

    // Compose it back.
    errStack = errorLines.map((line) => `  ${line}`).join('\n')
    errStack = chalk.grey(`\n${errStack}`)

    return errStack
  } else {
    return ''
  }
}
