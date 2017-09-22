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
const childProcess = require('child_process')
const spawn = require('cross-spawn')
const checkVersion = require('../lib/check-version')
const generate = require('../lib/generate.js')
const options = require('../lib/option-list.js').prompt
const exec = childProcess.exec
const execSync = childProcess.execSync

program
  .usage('[project-name]')
  .option('-o, --offline', '使用本地模板')
  .option('-i, --install', '下载模板后自动安装依赖')
  .parse(process.argv)

const name = program.args[0]
// 如果init命令输入了name参数
if (name) options['name'].default = name
// 检查版本
checkVersion(() => {
  console.log(chalk.red(figlet.textSync('YA CLI')))
  downloadTemplate('MingNeo/ya-template')
})

/**
 * 下载模板
 * 
 * @param {string} template 
 */
function downloadTemplate(template) {
  // 模板存储路径为本地的用户目录 如windows在Users/[user]
  var localTemp = path.join(home, '.ya-templates', template.replace(/\//g, '-'))
  // localTemp = path.resolve('D:\\code\\demos\\ya-templates')
  // 使用本地模板
  if (program.offline && exists(localTemp)) {
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

/**
 * 生成实例
 * 
 * @param {string} name 
 * @param {any} src 
 * @param {any} dest 
 * @param {any} done 
 */
function startGenerate(name, src, dest, done) {
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
        message: '是否立刻安装依赖？(优先使用yarn,如本机未安装则使用npm install)'
      }]).then(args => args.autoInstall && installModules(dest))
  })
}

/**
 * 安装模块
 * 
 * @param {any} dest 
 */
function installModules(dest) {
  var spinnerInstall = ora('安装依赖').start()
  // 优先使用yarn安装
  let command = 'yarnpkg'
  let args = []
  if (!shouldUseYarn()) {
    command = 'npm'
    args = ['install']
  }

  spawn(command, args, { stdio: 'inherit', cwd: dest })
    .on('close', () => spinnerInstall.stop())
}

/**
 * 判断本机是否可用yarn
 * 
 * @returns 
 */
function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}
