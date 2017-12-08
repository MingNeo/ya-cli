#!/usr/bin/env node
const program = require('commander');
program
  .version(require('../package.json').version)
  .usage('<command> [options]')
  .command('init', '从模板生成一个项目')
  .command('update', '从模板更新一个项目')
  .command('build', '构建项目');
program.parse(process.argv);
