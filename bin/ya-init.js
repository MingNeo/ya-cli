#!/usr/bin/env node

const inquirer = require('inquirer')
const program = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')
const path = require('path')
const ora = require('ora')
const exists = require('fs').existsSync
const rm = require('rimraf').sync
const download = require('download-git-repo')
const home = require('user-home')
var exec = require('child_process').exec
const checkVersion = require('../lib/check-version')
const generate = require('../lib/generate.js')
const opts = require('../lib/option-list.js')

program
  .usage('[project-name]')
  .option('-o, --offline', '使用本地模板')
  .option('-i, --install', '下载模板后自动安装依赖')
  .parse(process.argv)

const name = program.args[0]
// 如果init命令输入了name参数
if (name) opts['name'].default = name
// 检查版本
checkVersion(() => {
  console.log(chalk.red(figlet.textSync('YA CLI')))
  downloadTemplate('MingNeo/ya-template')
})

function downloadTemplate (template) {
  // 模板存储路径为本地的用户目录 如windows在Users/[user]
  var localTemp = path.join(home, '.ya-templates', template.replace(/\//g, '-'))
  // 使用本地模板
  if (program.offline) {
    localTemp = path.resolve('D:\\code\\demos\\ya-templates')
    console.log(`使用位于${chalk.yellow(localTemp)}的本地模板`)
    startGenerate(name, localTemp)
  } else {
    const spinner = ora('正在下载模板')
    spinner.start()
    if (exists(localTemp)) rm(localTemp)

    download(template, localTemp, {}, err => {
      spinner.stop()
      if (err) return console.log(chalk.red('  下载模板失败！'))
      startGenerate(name, localTemp)
    })
  }
}

function startGenerate (name, src, dest, done) {
  dest = dest || path.resolve(name || '.')
  generate(name, src, dest, done || function () {
    console.log()
    console.log(chalk.green('  应用模板成功！'))
    console.log()
    program.install
      ? installModules(dest)
      : inquirer.prompt([{
        name: 'autoInstall',
        type: 'confirm',
        message: '是否立刻安装依赖？'
      }]).then(args => args.autoInstall && installModules(dest))
  })
}

function installModules (dest) {
  var spinnerInstall = ora('安装依赖').start()
  let install = exec('npm install', { cwd: dest }, (err, stdout, stderr) => {
    if (err) throw err
    spinnerInstall.stop()
  })
  install.stdout.on('data', data => {
    console.log(data)
  })
}
