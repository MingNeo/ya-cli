#!/usr/bin/env node

const program = require('commander');
const spawn = require('cross-spawn');

program
  .usage('[project-name]')
  .option('-o, --offline', '使用本地模板')
  .option('--template [value]', '选择使用的模板')
  .option('-i, --install', '下载模板后自动安装依赖')
  .parse(process.argv);

let command = 'ya';
let args = ['init'].concat(program.rawArgs.slice(2) || [], ['--save']);
spawn(command, args, { stdio: 'inherit' });
