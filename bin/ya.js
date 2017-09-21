#!/usr/bin/env node

require('commander')
  .version(require('../package.json').version)
  .usage('<command> [options]')
  .command('init', '从模板生成一个项目')
  .command('build', '构建项目')
  .option('-o, --offline', '使用本地模板')
  .option('-i, --install', '下载模板后自动安装依赖')
  .parse(process.argv)
