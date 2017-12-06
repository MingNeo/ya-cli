#!/usr/bin/env node

require("commander")
  .version(require("../package.json").version)
  .usage("<command> [options]")
  .command("init", "从模板生成一个项目")
  .command("update", "更新项目到模板最新")
  .command("build", "构建项目")
  .parse(process.argv);
