#!/usr/bin/env node

const inquirer = require('inquirer');
const program = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const path = require('path');
const ora = require('ora');
const exists = require('fs').existsSync;
const rm = require('rimraf').sync;
const download = require('download-git-repo');
const home = require('user-home');
const childProcess = require('child_process');
const spawn = require('cross-spawn');
const checkVersion = require('../lib/check-version');
const generate = require('../lib/generate.js');
const options = require('../lib/option-list.js').prompt;
const exec = childProcess.exec;
const execSync = childProcess.execSync;

program
  .usage('[project-name]')
  .option('-o, --offline', '使用本地模板')
  .option('--template [value]', '选择使用的模板', 'q13/ya-spa-vue')
  .option('-i, --install', '下载模板后自动安装依赖')
  .parse(process.argv);

program.on('--help', function() {
  console.log('  Examples:');
  console.log();
  console.log(chalk.gray('    # 使用本地模板&自动安装依赖'));
  console.log('    $ ya init my-project -i -o');
  console.log();
  console.log(chalk.gray('    # 安装完成后,运行时可以自己配置port及proxy'));
  console.log('    $ cd ./my-project');
  console.log('    $ npm run dev [port=8082] [proxy=127.0.0.1]');
  console.log();
});

const name = program.args[0];
const projectDest = path.resolve(name || '.');
let save = false;
// 如果init命令输入了name参数
if (name) options['name'].default = name;
run();

function run() {
  // 检查版本
  checkVersion(() => {
    console.log(chalk.red(figlet.textSync('YA CLI')));
    program.tempalte = program.tempalte || 'q13/ya-spa-vue';
    checkDest();
  });
}

function checkDest() {
  if (exists(projectDest)) {
    inquirer
      .prompt([
        {
          type: 'list',
          message: '目录已经存在，如何处理？',
          name: 'ok',
          choices: [
            {
              name: '清空目录',
              value: 'del',
              short: 'del',
            },
            {
              name: '合并 (合并/覆盖 ["src", "/index.js"] 以外文件)',
              value: 'save',
              short: 'save',
            },
          ],
        },
      ])
      .then(args => {
        save = args.ok === 'save';
        if (args.ok === 'del') rm(path.join(projectDest, '*'));
        downloadTemplate(program.tempalte);
      });
  } else {
    downloadTemplate(program.tempalte);
  }
}
/**
 * 下载模板
 *
 * @param {string} template
 */
function downloadTemplate(template) {
  // 模板存储路径为本地的用户目录 如windows在Users/[user]
  var localTemp = path.join(home, '.ya-templates', template.replace(/\//g, '-'));
  // 使用本地模板
  if (program.offline && exists(localTemp)) {
    console.log(`使用位于${chalk.yellow(localTemp)}的本地模板`);
    startGenerate(name, localTemp, projectDest);
  } else {
    program.offline && console.log(`本地模板不存在，将使用${program.tempalte}的预设模板`);
    const spinner = ora('正在下载模板');
    spinner.start();
    if (exists(localTemp)) rm(localTemp);
    download(template, localTemp, {}, err => {
      spinner.stop();
      if (err) return console.log(chalk.red('  下载模板失败！'));

      if (!save && program.tempalte === 'q13/ya-spa-vue') {
        console.log();
        console.log(chalk.yellow(`  使用${program.tempalte}的预设模板, 默认开启lint，集成router、vuex，使用vuex等`));
        console.log();
        console.log('    $ cd projectPath');
        console.log('    $ npm run dev 开始开发');
      }

      startGenerate(name, localTemp, projectDest);
    });
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
  generate(
    name,
    src,
    dest,
    done ||
      function() {
        console.log();
        console.log(chalk.green('  应用模板成功！'));
        console.log();
        program.install
          ? installModules(dest)
          : inquirer
              .prompt([
                {
                  name: 'autoInstall',
                  type: 'confirm',
                  message: '是否立刻安装依赖？(优先使用yarn,如本机未安装则使用npm install)',
                },
              ])
              .then(args => args.autoInstall && installModules(dest));
      },
    { save },
  );
}

/**
 * 安装模块
 *
 * @param {any} dest
 */
function installModules(dest) {
  var spinnerInstall = ora('安装依赖').start();
  // 优先使用yarn安装
  let command = 'yarnpkg';
  let args = [];
  if (!shouldUseYarn()) {
    command = 'npm';
    args = ['install'];
  }

  spawn(command, args, { stdio: 'inherit', cwd: dest }).on('close', () => spinnerInstall.stop());
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
