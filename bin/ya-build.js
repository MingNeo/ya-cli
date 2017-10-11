#!/usr/bin/env node

const program = require('commander')
const path = require('path')
program
  .option('--proxy [value]', '代理')
  .option('--port [value]', '端口')
  .parse(process.argv)

const options = ['run','dev']
program.proxy && options.push(`proxy=${program.proxy}`)
program.port && options.push(`port=${program.port}`)
require('cross-spawn')('npm', options, { stdio: 'inherit', cwd: path.resolve('.') })